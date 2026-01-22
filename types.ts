
export interface Project {
  id: string;
  title: string;
  category: 'Typography' | 'UX/UI' | '3D Design' | 'Web Development';
  imageUrl: string;
  description: string;
  // Case Study fields
  role?: string;
  timeline?: string;
  tools?: string[];
  conceptTitle?: string;
  conceptDescription?: string;
  gridTitle?: string;
  gridDescription?: string;
  processGallery?: {
    url: string;
    caption: string;
  }[];
}

export interface Skill {
  name: string;
  icon: string;
  description: string;
}

export interface Inspiration {
  topic: string;
  challenge: string;
}
