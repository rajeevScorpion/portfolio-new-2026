
import React from 'react';
import { Palette, Layers, Box, Code, Camera, BookOpen } from 'lucide-react';
import { Project, Skill } from './types';

export const SKILLS: Skill[] = [
  {
    name: 'Typography',
    icon: 'Palette',
    description: 'Expertise in font pairing, typesetting, and custom letterform design for brand identities.'
  },
  {
    name: 'UX/UI Design',
    icon: 'Layers',
    description: 'Crafting user-centric interfaces with focus on accessibility, flow, and pixel-perfect execution.'
  },
  {
    name: '3D Design',
    icon: 'Box',
    description: 'Visualizing concepts in 3D space, from abstract compositions to realistic product mockups.'
  },
  {
    name: 'Web Development',
    icon: 'Code',
    description: 'Building modern, responsive, and high-performance web applications using React and Tailwind.'
  }
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Typographic Renaissance',
    category: 'Typography',
    imageUrl: 'https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?q=80&w=1200&auto=format&fit=crop',
    description: 'This project explores the revival of classic Swiss design principles in the context of contemporary user experience.',
    role: 'Lead Designer',
    timeline: '4 Weeks',
    tools: ['Figma', 'React', 'Spline'],
    conceptTitle: 'The Concept',
    conceptDescription: "Minimalism isn't just about removing elements; it's about the precision of what remains. We used Akzidenz-Grotesk for primary headings to maintain a historical link.",
    gridTitle: 'The Grid',
    gridDescription: 'A rigorous 12-column grid system was implemented to ensure mathematical harmony across all screen sizes.',
    processGallery: [
      {
        url: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=800&auto=format&fit=crop',
        caption: 'Initial typeface explorations focusing on legibility and geometric balance.'
      },
      {
        url: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800&auto=format&fit=crop',
        caption: 'Applying the grid system to complex hierarchical layouts.'
      }
    ]
  },
  {
    id: '2',
    title: 'Eco-System App',
    category: 'UX/UI',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    description: 'A mobile platform connecting local farmers with sustainable consumers through interactive mapping and real-time logistics.',
    role: 'Product Designer',
    timeline: '8 Weeks',
    tools: ['Figma', 'Protopie', 'React Native'],
    conceptTitle: 'Circular Economy',
    conceptDescription: "We focused on reducing friction between supply and demand. The interface uses organic shapes and earth tones to reflect the brand's sustainable values.",
    gridTitle: 'Modular UI',
    gridDescription: 'Every component was built with atomic design principles, allowing for rapid iteration and scaling across different device types.',
    processGallery: [
      {
        url: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=800&auto=format&fit=crop',
        caption: 'Low-fidelity wireframing of the user onboarding experience.'
      },
      {
        url: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?q=80&w=800&auto=format&fit=crop',
        caption: 'Testing color accessibility for outdoor usage scenarios.'
      }
    ]
  },
  {
    id: '3',
    title: 'Neon Abstract Series',
    category: '3D Design',
    imageUrl: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1200&auto=format&fit=crop',
    description: 'Exploration of light and transparency through abstract 3D glass compositions.',
    role: 'Visual Artist',
    timeline: '2 Weeks',
    tools: ['Blender', 'Octane Render', 'Photoshop'],
    conceptTitle: 'Refractive Logic',
    conceptDescription: 'Study on how light interacts with complex prismatic surfaces. The goal was to create digital objects that felt tangible yet impossible.',
    gridTitle: 'Composition',
    gridDescription: 'Using the golden ratio to guide the placement of light sources and focal points within the 3D scene.',
    processGallery: [
      {
        url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop',
        caption: 'Material node setup for advanced light dispersion.'
      }
    ]
  },
  {
    id: '4',
    title: 'Architect Portfolio',
    category: 'Web Development',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    description: 'A minimalist portfolio site with complex grid layouts and smooth transitions.',
    role: 'Full Stack Developer',
    timeline: '6 Weeks',
    tools: ['Next.js', 'Framer Motion', 'Tailwind'],
    conceptTitle: 'Structural Integrity',
    conceptDescription: 'The website architecture mimics physical building blueprints, using whitespace as a structural element.',
    gridTitle: 'Asymmetric Grid',
    gridDescription: 'A custom CSS grid that breaks the standard 12-column flow to create visual tension and interest.',
    processGallery: [
      {
        url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
        caption: 'Optimizing performance for high-resolution architectural imagery.'
      }
    ]
  },
  {
    id: '5',
    title: 'Typographic Posters',
    category: 'Typography',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop',
    description: 'A series of posters exploring the intersection of Swiss style and digital glitches.',
    role: 'Graphic Designer',
    timeline: '3 Weeks',
    tools: ['Illustrator', 'After Effects'],
    conceptTitle: 'Controlled Chaos',
    conceptDescription: 'Distorting rigid typographic rules through programmed glitch algorithms.',
    gridTitle: 'Poster Grid',
    gridDescription: 'A classic 9-column poster grid serving as the foundation for digital destruction.',
    processGallery: [
      {
        url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
        caption: 'Experimental print techniques combined with digital distortions.'
      }
    ]
  },
  {
    id: '6',
    title: 'Fintech Dashboard',
    category: 'UX/UI',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    description: 'Simplifying complex financial data through intuitive visualization and hierarchy.',
    role: 'UI Designer',
    timeline: '5 Weeks',
    tools: ['Figma', 'React', 'D3.js'],
    conceptTitle: 'Data Clarity',
    conceptDescription: 'Reducing cognitive load by prioritizing essential financial metrics.',
    gridTitle: 'Responsive Dashboard',
    gridDescription: 'Dynamic flexbox layouts that adapt seamlessly from mobile to ultrawide monitors.',
    processGallery: [
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
        caption: 'Iterative dashboard layout testing with real financial datasets.'
      }
    ]
  }
];

export const HOBBIES = [
  {
    name: 'Photography',
    icon: <Camera className="w-5 h-5" />,
    description: 'Capturing street life and architectural geometries.'
  },
  {
    name: 'Tech Blogging',
    icon: <BookOpen className="w-5 h-5" />,
    description: 'Writing about the intersection of design systems and frontend engineering.'
  }
];
