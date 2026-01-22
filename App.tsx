
import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Moon, Palette, Layers, Box, Code, ChevronRight, Mail, Instagram, Linkedin, Twitter, Sparkles, Menu, X, Send, CheckCircle2 } from 'lucide-react';
import { SKILLS, PROJECTS, HOBBIES } from './constants';
import { getDesignInspiration } from './services/geminiService';
import { Project, Inspiration } from './types';

// Define the available categories for filtering projects
const categories = ['All', 'Typography', 'UX/UI', '3D Design', 'Web Development'];

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inspiration, setInspiration] = useState<Inspiration | null>(null);
  const [loadingInspiration, setLoadingInspiration] = useState(false);

  // Form State
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const navLinks = [
    { label: 'Work', href: '#work', id: 'work' },
    { label: 'Expertise', href: '#skills', id: 'skills' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      setIsMenuOpen(false);
      setActiveSection(id);
      const offset = 80; // height of the fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const filteredProjects = activeCategory === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === activeCategory);

  const fetchInspiration = async () => {
    setLoadingInspiration(true);
    const result = await getDesignInspiration();
    setInspiration(result);
    setLoadingInspiration(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://formspree.io/f/xykkrpel", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormState({ name: '', email: '', message: '' });
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const errorData = await response.json();
        console.error("Formspree Error:", errorData);
        alert("Oops! There was a problem submitting your form. Please try again.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Oops! There was a network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Scroll reveal observer
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Scroll spy observer for active links
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.4, rootMargin: "-80px 0px -50% 0px" });

    document.querySelectorAll('section[id]').forEach((section) => {
      sectionObserver.observe(section);
    });

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, [activeCategory]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans selection:bg-primary-500 selection:text-white overflow-x-hidden">
        
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-slate-200 dark:border-white/10 h-20">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            <a 
              href="#home" 
              onClick={(e) => handleNavClick(e, 'home')} 
              className="text-xl font-bold tracking-tighter hover:scale-105 transition-transform"
            >
              RAJEEV<span className="text-primary-500">.</span>
            </a>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              {navLinks.map((link) => (
                <a 
                  key={link.id}
                  href={link.href} 
                  onClick={(e) => handleNavClick(e, link.id)}
                  aria-current={activeSection === link.id ? 'page' : undefined}
                  className={`transition-all duration-300 relative group py-2 ${
                    activeSection === link.id ? 'text-primary-500' : 'hover:text-primary-500 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary-500 origin-left transition-transform duration-300 ${activeSection === link.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </a>
              ))}
              
              <button 
                onClick={toggleDarkMode}
                className="ml-4 p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-90"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            {/* Mobile Nav Toggle */}
            <div className="flex md:hidden items-center space-x-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 transition-colors z-[110]"
                aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          <div 
            className={`fixed inset-0 z-[105] bg-white dark:bg-black transition-all duration-500 ease-in-out md:hidden flex flex-col justify-center items-center ${
              isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
            }`}
          >
            <div className="flex flex-col space-y-8 text-center">
              {navLinks.map((link) => (
                <a 
                  key={link.id}
                  href={link.href} 
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`text-4xl font-bold tracking-tighter transition-colors ${
                    activeSection === link.id ? 'text-primary-500' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Home Section (Hero) */}
        <section id="home" className="pt-40 pb-20 px-6 min-h-[80vh] flex items-center">
          <div className="max-w-7xl mx-auto w-full">
            <div className="reveal opacity-0 translate-y-10 transition-all duration-1000">
              <span className="inline-block px-4 py-1 rounded-full border border-primary-500 text-primary-500 text-xs font-semibold mb-6">
                COMMUNICATION DESIGN STUDENT
              </span>
              <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[1.1] mb-8">
                Crafting digital <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500">narratives</span> through <br />
                design and code.
              </h1>
              <p className="max-w-xl text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
                I'm Rajeev Kumar, a designer specializing in bridging the gap between aesthetics and functionality. Based in the intersection of Typography, UX, and 3D.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#work" 
                  onClick={(e) => handleNavClick(e, 'work')}
                  className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-semibold transition-all hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:-translate-y-1"
                >
                  View My Work
                </a>
                <button 
                  onClick={fetchInspiration}
                  disabled={loadingInspiration}
                  className="flex items-center space-x-2 px-8 py-4 border border-slate-200 dark:border-white/10 rounded-full font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-all hover:-translate-y-1"
                >
                  <Sparkles size={18} className={loadingInspiration ? 'animate-spin' : ''} />
                  <span>{loadingInspiration ? 'Generating...' : 'Get Inspiration'}</span>
                </button>
              </div>
            </div>

            {/* AI Inspiration Card */}
            {inspiration && (
              <div className="mt-12 p-6 rounded-2xl border border-primary-500/30 bg-primary-500/5 backdrop-blur-sm max-w-2xl reveal opacity-0 translate-y-10 transition-all duration-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-primary-500">
                    <Sparkles size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">AI Challenge for you</span>
                  </div>
                  <button onClick={() => setInspiration(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={16} /></button>
                </div>
                <h3 className="text-xl font-bold mb-2">{inspiration.topic}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{inspiration.challenge}</p>
              </div>
            )}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-24 px-6 bg-slate-50 dark:bg-zinc-950/50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 reveal opacity-0 translate-y-10 transition-all duration-1000">
              <h2 className="text-4xl font-bold tracking-tighter mb-4">Core Expertise</h2>
              <div className="w-20 h-1 bg-primary-500 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {SKILLS.map((skill, idx) => (
                <div 
                  key={idx} 
                  className="reveal opacity-0 translate-y-10 p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 transition-all hover:border-primary-500 group hover:shadow-xl dark:hover:shadow-primary-500/10"
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 mb-6 group-hover:scale-110 transition-transform">
                    {skill.name === 'Typography' && <Palette size={24} />}
                    {skill.name === 'UX/UI Design' && <Layers size={24} />}
                    {skill.name === '3D Design' && <Box size={24} />}
                    {skill.name === 'Web Development' && <Code size={24} />}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{skill.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{skill.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="work" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div className="reveal opacity-0 translate-y-10 transition-all duration-1000">
                <h2 className="text-4xl font-bold tracking-tighter mb-4">Selected Work</h2>
                <div className="w-20 h-1 bg-primary-500 rounded-full"></div>
              </div>
              
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                      activeCategory === cat 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-slate-100 dark:bg-white/10 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Corrected the typo in 'filteredProjects' array map */}
              {filteredProjects.map((project) => (
                <div 
                  key={project.id}
                  className="reveal opacity-0 translate-y-10 group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl mb-6 bg-slate-100 dark:bg-white/5">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      loading="lazy"
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black scale-50 group-hover:scale-100 transition-transform">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">{project.category}</span>
                    <h3 className="text-xl font-bold mt-1 group-hover:text-primary-500 transition-colors">{project.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-6 bg-slate-50 dark:bg-zinc-950/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="reveal opacity-0 translate-y-10 transition-all duration-1000">
                <div className="relative group">
                  <div className="aspect-square rounded-3xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                    <img src="https://picsum.photos/seed/rajeev/800/800" alt="Rajeev Kumar" className="object-cover w-full h-full" loading="lazy" />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary-500 rounded-3xl -z-10 animate-pulse opacity-50"></div>
                </div>
              </div>
              
              <div className="reveal opacity-0 translate-y-10 transition-all duration-1000">
                <h2 className="text-4xl font-bold tracking-tighter mb-8">Beyond the pixels.</h2>
                <div className="space-y-6 text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                  <p>
                    I believe that great design is not just about how it looks, but how it communicates and solves problems. My journey in communication design has led me to explore the intersection of traditional typography and modern web technologies.
                  </p>
                  <p>
                    When I'm not pushing pixels or debugging code, you can find me wandering the streets with my camera or writing about the latest trends in technology and design on my blog.
                  </p>
                </div>

                <div className="mt-12">
                  <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-400">Hobbies & Interests</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {HOBBIES.map((hobby, i) => (
                      <div key={i} className="flex items-start space-x-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:border-primary-500/50 transition-colors">
                        <div className="text-primary-500 mt-1">{hobby.icon}</div>
                        <div>
                          <p className="font-bold text-sm">{hobby.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{hobby.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 px-6 overflow-hidden min-h-screen flex items-center relative">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="reveal opacity-0 translate-y-10 transition-all duration-1000 text-left">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-none">Let's build something <span className="italic font-light text-primary-500">extraordinary</span>.</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-lg">
                Always looking for new challenges and creative collaborations. Feel free to reach out for a project or just a coffee chat.
              </p>
              
              <div className="space-y-6">
                <a href="mailto:hello@rajeevkumar.design" className="flex items-center space-x-4 group w-fit">
                  <div className="p-3 rounded-full bg-slate-100 dark:bg-white/5 group-hover:bg-primary-500 group-hover:text-white transition-all">
                    <Mail size={20} />
                  </div>
                  <span className="font-medium">hello@rajeevkumar.design</span>
                </a>
              </div>

              <div className="mt-12 flex space-x-6">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-primary-500 hover:text-white transition-all hover:-translate-y-2"><Instagram size={24} /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-primary-500 hover:text-white transition-all hover:-translate-y-2"><Linkedin size={24} /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-primary-500 hover:text-white transition-all hover:-translate-y-2"><Twitter size={24} /></a>
              </div>
            </div>

            <div className="reveal opacity-0 translate-y-10 transition-all duration-1000 delay-200">
              <div className="p-8 md:p-10 rounded-[2.5rem] bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 backdrop-blur-sm">
                {submitted ? (
                  <div className="py-12 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-primary-500/20 text-primary-500 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-bold">Message Sent!</h3>
                    <p className="text-slate-500 dark:text-slate-400">Thanks for reaching out, Rajeev will get back to you soon.</p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-primary-500 font-semibold hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Name</label>
                      <input 
                        type="text" 
                        id="name"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleFormChange}
                        placeholder="Your Name"
                        className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-0 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email</label>
                      <input 
                        type="email" 
                        id="email"
                        name="email"
                        required
                        value={formState.email}
                        onChange={handleFormChange}
                        placeholder="hello@example.com"
                        className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-0 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Message</label>
                      <textarea 
                        id="message"
                        name="message"
                        required
                        rows={4}
                        value={formState.message}
                        onChange={handleFormChange}
                        placeholder="Tell me about your project..."
                        className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-0 transition-all outline-none resize-none"
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full group relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-slate-900 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-500 hover:text-white dark:text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                      <span className="relative w-full px-10 py-5 transition-all ease-in duration-75 bg-white dark:bg-black rounded-[1.2rem] group-hover:bg-opacity-0">
                        <span className="flex items-center justify-center space-x-3 text-lg font-bold">
                          {isSubmitting ? (
                            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <Send size={20} />
                              <span>Send Message</span>
                            </>
                          )}
                        </span>
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-slate-100 dark:border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 gap-6">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <p>© 2024 Rajeev Kumar. Built for Communication Design Excellence.</p>
              <p className="text-xs text-slate-400 mt-1 italic">Vercel-optimized architecture for high performance.</p>
            </div>
            <div className="flex space-x-8">
              <a href="#work" onClick={(e) => handleNavClick(e, 'work')} className="hover:text-primary-500 transition-colors">Work</a>
              <a href="#skills" onClick={(e) => handleNavClick(e, 'skills')} className="hover:text-primary-500 transition-colors">Expertise</a>
              <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-primary-500 transition-colors">About</a>
              <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="hover:text-primary-500 transition-colors font-bold">Back to top</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default App;
