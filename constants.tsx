
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
    title: 'Modern Sans Revival',
    category: 'Typography',
    imageUrl: 'https://picsum.photos/seed/typo1/800/600',
    description: 'A contemporary take on grotesque typefaces optimized for digital screens.'
  },
  {
    id: '2',
    title: 'Eco-System App',
    category: 'UX/UI',
    imageUrl: 'https://picsum.photos/seed/ux1/800/600',
    description: 'A mobile platform connecting local farmers with sustainable consumers.'
  },
  {
    id: '3',
    title: 'Neon Abstract Series',
    category: '3D Design',
    imageUrl: 'https://picsum.photos/seed/3d1/800/600',
    description: 'Exploration of light and transparency through abstract 3D glass compositions.'
  },
  {
    id: '4',
    title: 'Architect Portfolio',
    category: 'Web Development',
    imageUrl: 'https://picsum.photos/seed/web1/800/600',
    description: 'A minimalist portfolio site with complex grid layouts and smooth transitions.'
  },
  {
    id: '5',
    title: 'Typographic Posters',
    category: 'Typography',
    imageUrl: 'https://picsum.photos/seed/typo2/800/600',
    description: 'A series of posters exploring the intersection of Swiss style and digital glitches.'
  },
  {
    id: '6',
    title: 'Fintech Dashboard',
    category: 'UX/UI',
    imageUrl: 'https://picsum.photos/seed/ux2/800/600',
    description: 'Simplifying complex financial data through intuitive visualization and hierarchy.'
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
