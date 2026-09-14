import type { Project } from '@/types';

export const FRACA: Project = {
  id: 'fraca',
  title: 'FRACA SERVCOM Inventory System',
  category: 'Web Application',
  year: 2024,
  techStack: [
    'Laravel 12',
    'PHP 8.1+',
    'MySQL',
    'Blade',
    'Bootstrap 5',
    'JavaScript/Axios',
    'Vite',
    'Spatie Media Library',
  ],
  features: [
    'Multi-supplier management',
    'Real-time stock tracking',
    'Media uploads',
    'Role-based access control',
  ],
  outcomeMetrics: [
    '99.9% data integrity',
    '500+ products managed',
    '20+ suppliers tracked',
    'Stock accuracy improved from 75% to 99%',
  ],
  repoUrl: 'https://github.com/PhilipLee2002/fraca-inventory-system',
  repoLabel: '(Private Repository)',
  reflectionText:
    'This project taught me the value of designing for real operational constraints. Working directly with the client revealed how much the final product depends on understanding the humans using it daily.',
  imagePlaceholderType: 'gradient',
};

export const NOVA: Project = {
  id: 'nova',
  title: 'Nova Terminal AI Assistant',
  category: 'CLI Tool / AI',
  year: 2024,
  techStack: [
    'Python 3.8+',
    'LM Studio',
    'Qwen2.5-Coder-1.5B',
    'Requests',
    'Typer',
    'Rich',
  ],
  features: [
    'Fully offline AI inference',
    'Streaming responses',
    '/scaffold code generation',
    'Terminal-first UX',
  ],
  outcomeMetrics: [
    'Fully offline — no API keys required',
    '<8s response times on consumer hardware',
    '/scaffold speeds up boilerplate generation by ~70%',
  ],
  repoUrl: undefined,
  reflectionText:
    'Nova emerged from a desire to keep AI tooling entirely local. Privacy and speed were the primary constraints — and they shaped every design decision from the ground up.',
  imagePlaceholderType: 'terminal',
};

export const PROJECTS: Project[] = [NOVA];
// Add later projects to this array — they stack as additional case studies.
