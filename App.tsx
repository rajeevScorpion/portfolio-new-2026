
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Sun, Moon, Palette, Layers, Box, Code, ChevronRight, Mail, Instagram, Linkedin, Twitter, Sparkles, Menu, X, Send, CheckCircle2, ArrowLeft, Maximize2, MessageCircle, Bot, User, Loader2 } from 'lucide-react';
import { SKILLS, PROJECTS, HOBBIES } from './constants';
import { getDesignInspiration } from './services/geminiService';
import { Project, Inspiration } from './types';
import { GoogleGenAI } from "@google/genai";

const categories = ['All', 'Typography', 'UX/UI', '3D Design', 'Web Development'];

const Lightbox: React.FC<{ imageUrl: string; onClose: () => void }> = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out" onClick={onClose}>
      <button 
        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >
        <X size={32} />
      </button>
      <img 
        src={imageUrl} 
        alt="Zoomed project image" 
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in duration-300" 
      />
    </div>
  );
};

const ChatBot: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Hi! I'm Rajeev's AI assistant. How can I help you explore his design work today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const chatRef = useRef<any>(null);

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are Rajeev Kumar's professional AI assistant. Rajeev is a Communication Design student specializing in Typography, UX/UI, 3D, and Web Development. Be helpful, concise, and professional. Mention his expertise in 'Swiss design principles' or 'modular UI' if relevant. Keep answers under 3 sentences.",
      },
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMessage });
      const botText = response.text;
      setMessages(prev => [...prev, { role: 'model', text: botText || "I'm having trouble thinking right now. Could you try again?" }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-28 right-6 md:right-10 w-[calc(100vw-3rem)] md:w-96 h-[500px] bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col overflow-hidden z-[200] animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="p-6 bg-primary-500 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Bot size={20} />
          </div>
          <div>
            <p className="font-bold leading-none">Rajeev AI</p>
            <p className="text-[10px] opacity-70 uppercase tracking-widest mt-1">Online Assistant</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-primary-500 text-white rounded-tr-none' 
                : 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-slate-100 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-2xl rounded-tl-none flex items-center space-x-2">
              <Loader2 size={16} className="animate-spin text-primary-500" />
              <span className="text-xs text-slate-400">Assistant is thinking...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-black/20">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about my work..."
            className="w-full px-6 py-4 pr-14 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/5 focus:border-primary-500 transition-all outline-none text-sm"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 p-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 transition-all active:scale-95"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inspiration, setInspiration] = useState<Inspiration | null>(null);
  const [loadingInspiration, setLoadingInspiration] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Form State
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const selectedProject = useMemo(() => 
    PROJECTS.find(p => p.id === selectedProjectId), 
  [selectedProjectId]);

  const navLinks = [
    { label: 'Work', href: '#work', id: 'work' },
    { label: 'Expertise', href: '#skills', id: 'skills' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (selectedProjectId) {
      setSelectedProjectId(null);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      setActiveSection(id);
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, [selectedProjectId]);

  const openProject = (id: string) => {
    setSelectedProjectId(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const closeProject = () => {
    setSelectedProjectId(null);
    setTimeout(() => {
      const workSection = document.getElementById('work');
      if (workSection) {
        window.scrollTo({ top: workSection.offsetTop - 80, behavior: 'instant' });
      }
    }, 0);
  };

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
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      if (response.ok) {
        setSubmitted(true);
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert("Oops! There was a problem submitting your form.");
      }
    } catch (error) {
      alert("Oops! There was a network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (selectedProjectId) return;

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

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
  }, [activeCategory, selectedProjectId]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans selection:bg-primary-500 selection:text-white overflow-x-hidden">
        
        {/* Navigation Bar */}
        <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-slate-200 dark:border-white/10 h-20">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            <button 
              onClick={() => { setSelectedProjectId(null); setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="text-xl font-bold tracking-tighter hover:scale-105 transition-transform"
            >
              RAJEEV<span className="text-primary-500">.</span>KUMAR
            </button>
            
            <div className="hidden md:flex items-center space-x-12">
              {selectedProjectId ? (
                <button 
                  onClick={closeProject}
                  className="flex items-center space-x-2 text-sm font-medium text-slate-500 hover:text-primary-500 transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Portfolio</span>
                </button>
              ) : (
                navLinks.map((link) => (
                  <a 
                    key={link.id}
                    href={link.href} 
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={`text-sm font-medium transition-all relative group py-2 ${
                      activeSection === link.id ? 'text-primary-500' : 'hover:text-primary-500 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {link.label}
                  </a>
                ))
              )}
              
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            <div className="flex md:hidden items-center space-x-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 text-slate-600 dark:text-slate-300 z-[120]"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation - Fly-in Offcanvas */}
        <div 
          className={`fixed inset-0 z-[115] transition-opacity duration-500 md:hidden ${
            isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Overlay Backdrop */}
          <div className="absolute inset-0 bg-white/90 dark:bg-black/95 backdrop-blur-lg"></div>
          
          {/* Menu Panel */}
          <div 
            className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-black shadow-2xl transition-transform duration-500 ease-in-out p-8 flex flex-col justify-center items-center text-center ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dedicated Close Button for Offcanvas */}
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 right-8 p-3 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-primary-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95"
              aria-label="Close navigation"
            >
              <X size={32} />
            </button>

            <div className="flex flex-col space-y-8">
              {navLinks.map((link) => (
                <a 
                  key={link.id}
                  href={link.href} 
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`text-5xl font-black tracking-tighter transition-all hover:scale-105 ${
                    activeSection === link.id ? 'text-primary-500' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
            
            <div className="mt-16 pt-16 border-t border-slate-100 dark:border-white/5 w-full flex justify-center space-x-8">
              <a href="#" className="p-4 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors"><Instagram size={28} /></a>
              <a href="#" className="p-4 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors"><Linkedin size={28} /></a>
              <a href="#" className="p-4 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors"><Twitter size={28} /></a>
            </div>
          </div>
        </div>

        {/* Case Study View */}
        {selectedProject ? (
          <main className="pt-32 pb-24 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-7xl mx-auto">
              {/* Case Study Header */}
              <div className="mb-12">
                <button 
                  onClick={closeProject}
                  className="text-xs font-bold uppercase tracking-widest text-primary-500 flex items-center space-x-2 mb-8 hover:translate-x-[-4px] transition-transform"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Portfolio</span>
                </button>
                <span className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-4 block">
                  {selectedProject.category}
                </span>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-tight">
                  {selectedProject.title}
                </h1>
                <p className="max-w-2xl text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {selectedProject.description}
                </p>
              </div>

              {/* Hero Image */}
              <div className="relative aspect-[16/8] w-full overflow-hidden rounded-[2.5rem] mb-24 shadow-2xl group cursor-zoom-in" onClick={() => setLightboxImage(selectedProject.imageUrl)}>
                <img src={selectedProject.imageUrl} alt={selectedProject.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={48} />
                </div>
              </div>

              {/* Project Brief Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                <div className="lg:col-span-3 space-y-12">
                  <div className="border-l-2 border-primary-500 pl-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Project Brief</h3>
                    <div className="space-y-8">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Role</p>
                        <p className="font-bold">{selectedProject.role || 'Lead Designer'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Timeline</p>
                        <p className="font-bold">{selectedProject.timeline || '4 Weeks'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Tools</p>
                        <p className="font-bold">{selectedProject.tools?.join(', ') || 'Figma, React'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-9 space-y-20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight mb-4">{selectedProject.conceptTitle || 'The Concept'}</h3>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                        {selectedProject.conceptDescription || "Focusing on the core user journey, we stripped away the noise to prioritize meaningful interactions."}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight mb-4">{selectedProject.gridTitle || 'The Grid'}</h3>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                        {selectedProject.gridDescription || "Every element sits on a strictly defined grid to maintain balance and rhythm throughout the experience."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Process Gallery */}
              {selectedProject.processGallery && selectedProject.processGallery.length > 0 && (
                <div className="mb-24">
                  <h2 className="text-3xl font-black tracking-tighter mb-12">Process Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {selectedProject.processGallery.map((item, idx) => (
                      <div key={idx} className="space-y-4 group">
                        <div 
                          className="relative aspect-video overflow-hidden rounded-3xl bg-slate-100 dark:bg-zinc-900 cursor-zoom-in"
                          onClick={() => setLightboxImage(item.url)}
                        >
                          <img src={item.url} alt={item.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                            <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                          </div>
                        </div>
                        <p className="text-xs italic text-slate-400 px-2 leading-relaxed">{item.caption}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explore Other Works */}
              <div className="pt-24 border-t border-slate-100 dark:border-white/10 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Want to see more?</p>
                <h2 className="text-5xl font-black tracking-tighter mb-12">Explore Other Works</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {PROJECTS.filter(p => p.id !== selectedProjectId).slice(0, 3).map(p => (
                    <button 
                      key={p.id}
                      onClick={() => openProject(p.id)}
                      className="group text-left"
                    >
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                      </div>
                      <h4 className="font-bold group-hover:text-primary-500 transition-colors">{p.title}</h4>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </main>
        ) : (
          /* Main Portfolio Landing Page */
          <>
            <section id="home" className="pt-40 pb-20 px-6 min-h-[80vh] flex items-center relative overflow-hidden">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
              <div className="max-w-7xl mx-auto w-full">
                <div className="reveal opacity-0 translate-y-10 transition-all duration-1000">
                  <span className="inline-block px-4 py-1 rounded-full border border-primary-500 text-primary-500 text-xs font-semibold mb-6">
                    COMMUNICATION DESIGN STUDENT
                  </span>
                  <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-12">
                    Crafting digital <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500">narratives</span><br />
                    through design.
                  </h1>
                  <p className="max-w-xl text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
                    I'm Rajeev Kumar, a designer specializing in bridging the gap between aesthetics and functionality. Based in the intersection of Typography, UX, and 3D.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href="#work" 
                      onClick={(e) => handleNavClick(e, 'work')}
                      className="px-10 py-5 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-bold transition-all hover:shadow-[0_0_40px_rgba(14,165,233,0.3)] hover:-translate-y-1"
                    >
                      View My Work
                    </a>
                    <button 
                      onClick={fetchInspiration}
                      disabled={loadingInspiration}
                      className="flex items-center space-x-2 px-10 py-5 border border-slate-200 dark:border-white/10 rounded-full font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all hover:-translate-y-1"
                    >
                      <Sparkles size={18} className={loadingInspiration ? 'animate-spin' : ''} />
                      <span>{loadingInspiration ? 'Thinking...' : 'Get Inspiration'}</span>
                    </button>
                  </div>
                </div>

                {inspiration && (
                  <div className="mt-12 p-8 rounded-[2rem] border border-primary-500/30 bg-primary-500/5 backdrop-blur-xl max-w-2xl reveal opacity-0 translate-y-10 transition-all duration-700 animate-in fade-in zoom-in">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-primary-500">
                        <Sparkles size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">AI Challenge</span>
                      </div>
                      <button onClick={() => setInspiration(null)} className="text-slate-400 hover:text-white"><X size={16} /></button>
                    </div>
                    <h3 className="text-2xl font-black mb-3">{inspiration.topic}</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{inspiration.challenge}</p>
                  </div>
                )}
              </div>
            </section>

            <section id="work" className="py-24 px-6 bg-slate-50/50 dark:bg-zinc-950/20">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                  <div className="reveal opacity-0 translate-y-10 transition-all duration-1000">
                    <h2 className="text-5xl font-black tracking-tighter mb-4">Selected Work</h2>
                    <div className="w-20 h-1.5 bg-primary-500 rounded-full"></div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                          activeCategory === cat 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-white dark:bg-white/5 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredProjects.map((project) => (
                    <div 
                      key={project.id}
                      onClick={() => openProject(project.id)}
                      className="reveal opacity-0 translate-y-10 group cursor-pointer"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] mb-6 bg-slate-200 dark:bg-zinc-900 shadow-lg">
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <div className="px-8 py-3 rounded-full bg-white text-black font-bold scale-50 group-hover:scale-100 transition-all duration-500 flex items-center space-x-2">
                            <span>View Case Study</span>
                            <ChevronRight size={18} />
                          </div>
                        </div>
                      </div>
                      <div className="px-2">
                        <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em] mb-2 block">{project.category}</span>
                        <h3 className="text-2xl font-black mb-2 group-hover:text-primary-500 transition-colors">{project.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{project.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="skills" className="py-24 px-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-10"></div>
              <div className="max-w-7xl mx-auto">
                <div className="mb-16 reveal opacity-0 translate-y-10 transition-all duration-1000">
                  <h2 className="text-5xl font-black tracking-tighter mb-4">Core Expertise</h2>
                  <div className="w-20 h-1.5 bg-primary-500 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {SKILLS.map((skill, idx) => (
                    <div 
                      key={idx} 
                      className="reveal opacity-0 translate-y-10 p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900/50 border border-slate-100 dark:border-white/5 transition-all hover:border-primary-500 group hover:shadow-2xl"
                      style={{ transitionDelay: `${idx * 100}ms` }}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 mb-8 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500">
                        {skill.name === 'Typography' && <Palette size={28} />}
                        {skill.name === 'UX/UI Design' && <Layers size={28} />}
                        {skill.name === '3D Design' && <Box size={28} />}
                        {skill.name === 'Web Development' && <Code size={28} />}
                      </div>
                      <h3 className="text-2xl font-black mb-4">{skill.name}</h3>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{skill.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="about" className="py-24 px-6 bg-slate-50/50 dark:bg-zinc-950/20">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                  <div className="reveal opacity-0 translate-y-10 transition-all duration-1000">
                    <div className="relative group p-4">
                      <div className="aspect-[4/5] rounded-[3rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000 shadow-2xl relative z-10">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" alt="Rajeev Kumar" className="object-cover w-full h-full" />
                      </div>
                      <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-primary-500 rounded-[3.5rem] -z-10 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-700"></div>
                    </div>
                  </div>
                  
                  <div className="reveal opacity-0 translate-y-10 transition-all duration-1000">
                    <h2 className="text-5xl font-black tracking-tighter mb-8 leading-tight">Driven by precision,<br />defined by curiosity.</h2>
                    <div className="space-y-6 text-slate-500 dark:text-slate-400 leading-relaxed text-lg font-medium">
                      <p>
                        I believe that great design is not just about how it looks, but how it communicates and solves problems. My journey in communication design has led me to explore the intersection of traditional typography and modern web technologies.
                      </p>
                      <p>
                        When I'm not pushing pixels or debugging code, you can find me wandering the streets with my camera or writing about the latest trends in technology and design.
                      </p>
                    </div>

                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {HOBBIES.map((hobby, i) => (
                        <div key={i} className="flex items-start space-x-6">
                          <div className="p-4 rounded-2xl bg-primary-500/10 text-primary-500">{hobby.icon}</div>
                          <div>
                            <p className="font-black text-lg">{hobby.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{hobby.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="contact" className="py-24 px-6 flex items-center relative min-h-screen">
              <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className="reveal opacity-0 translate-y-10 transition-all duration-1000">
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9]">Let's create something <span className="text-primary-500 italic font-light">iconic</span>.</h2>
                  <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-lg leading-relaxed">
                    Always looking for new challenges and creative collaborations. Feel free to reach out.
                  </p>
                  
                  <div className="space-y-4">
                    <a href="mailto:hello@rajeevkumar.design" className="text-2xl font-black hover:text-primary-500 transition-colors underline underline-offset-8">hello@rajeevkumar.design</a>
                    <div className="flex space-x-8 pt-8">
                      <a href="#" className="p-4 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-primary-500 hover:text-white transition-all hover:-translate-y-2"><Instagram size={24} /></a>
                      <a href="#" className="p-4 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-primary-500 hover:text-white transition-all hover:-translate-y-2"><Linkedin size={24} /></a>
                      <a href="#" className="p-4 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-primary-500 hover:text-white transition-all hover:-translate-y-2"><Twitter size={24} /></a>
                    </div>
                  </div>
                </div>

                <div className="reveal opacity-0 translate-y-10 transition-all duration-1000 delay-200">
                  <div className="p-10 md:p-14 rounded-[3.5rem] bg-white dark:bg-zinc-900 shadow-2xl border border-slate-100 dark:border-white/5">
                    {submitted ? (
                      <div className="py-20 flex flex-col items-center text-center space-y-6">
                        <div className="w-20 h-20 bg-primary-500/20 text-primary-500 rounded-full flex items-center justify-center">
                          <CheckCircle2 size={48} />
                        </div>
                        <h3 className="text-3xl font-black">Message Received!</h3>
                        <p className="text-slate-500 dark:text-slate-400">Rajeev will get back to you shortly.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-2">Name</label>
                          <input 
                            name="name" required value={formState.name} onChange={handleFormChange}
                            placeholder="Your Name"
                            className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-black border border-transparent focus:border-primary-500 transition-all outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-2">Email</label>
                          <input 
                            name="email" type="email" required value={formState.email} onChange={handleFormChange}
                            placeholder="Email Address"
                            className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-black border border-transparent focus:border-primary-500 transition-all outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-2">Message</label>
                          <textarea 
                            name="message" required rows={4} value={formState.message} onChange={handleFormChange}
                            placeholder="Brief your project..."
                            className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-black border border-transparent focus:border-primary-500 transition-all outline-none resize-none"
                          ></textarea>
                        </div>
                        <button 
                          type="submit" disabled={isSubmitting}
                          className="w-full py-6 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-black text-xl transition-all flex items-center justify-center space-x-3 shadow-xl hover:shadow-primary-500/30"
                        >
                          {isSubmitting ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                            <><Send size={24} /> <span>Send Message</span></>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Lightbox Overlay */}
        {lightboxImage && <Lightbox imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />}

        {/* AI Chat Bot */}
        {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}

        {/* Floating Chat Button */}
        {!selectedProjectId && (
           <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`fixed bottom-10 right-10 w-16 h-16 bg-primary-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[210] ${isChatOpen ? 'rotate-90' : 'rotate-0'}`}
          >
            {isChatOpen ? <X size={28} /> : <MessageCircle size={28} />}
          </button>
        )}

        {/* Footer */}
        <footer className="py-20 px-6 border-t border-slate-100 dark:border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400 gap-12">
            <p>© 2026 RAJEEV KUMAR. ALL RIGHTS RESERVED.</p>
            <div className="flex space-x-12">
              <button onClick={() => { setSelectedProjectId(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-primary-500 transition-colors">PROJECTS</button>
              <button className="hover:text-primary-500 transition-colors">STORY</button>
              <button className="hover:text-primary-500 transition-colors">TOOLKIT</button>
            </div>
            <p className="text-right">BUILT WITH REACT, TAILWIND & GEMINI AI</p>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default App;
