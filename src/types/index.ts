export type ProjectStage = 'deployed' | 'ready' | 'progress' | 'planning';

export interface ProjectNote {
  label: string;
  body: string;
}

export interface ProjectImage {
  src: string;
  /** Visible caption. Kept separate from the file name. */
  label: string;
  alt: string;
  /** Short note shown under this image. */
  note?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  stage: ProjectStage;
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
