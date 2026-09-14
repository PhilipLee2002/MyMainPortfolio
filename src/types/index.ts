export interface Project {
  id: string;
  title: string;
  category: string;
  year: number;
  techStack: string[];
  features: string[];
  outcomeMetrics: string[];
  repoUrl?: string;
  repoLabel?: string;
  reflectionText?: string;
  imagePlaceholderType: 'gradient' | 'terminal';
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
