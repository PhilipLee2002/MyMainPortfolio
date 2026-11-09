export type ProjectWeight = 'featured' | 'compact';

export interface ProjectNote {
  label: string;
  body: string;
}

export interface ProjectImage {
  src: string;
  /** Visible caption. Kept separate from the file name. */
  label: string;
  alt: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  weight: ProjectWeight;
  tagline: string;
  status: string;
  href?: string;
  role?: string;
  problem: string;
  contributionLabel: string;
  contribution: string;
  highlights: string[];
  note?: ProjectNote;
  techStack: string[];
  stackNote?: string;
  pointTo: string;
  images?: ProjectImage[];
  imageNotes: string[];
  imagePlaceholderType: 'gallery' | 'terminal';
  repoUrl?: string;
  repoLabel?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  errors: {
    name?: string;
    email?: string;
    message?: string;
    server?: string;
  };
}
