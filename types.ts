
export interface Project {
  id: string;
  title: string;
  category: 'Typography' | 'UX/UI' | '3D Design' | 'Web Development';
  imageUrl: string;
  description: string;
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
