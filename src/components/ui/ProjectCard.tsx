import { motion } from 'framer-motion';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  framerEnabled: boolean;
  /** 'split' gives the card room to breathe as a two-column layout — used
   *  by the full-width horizontal slider panels. 'stacked' (default) is
   *  the single-column layout used in the narrower 2-up grid fallback. */
  layout?: 'stacked' | 'split';
}

function hostLabel(href: string) {
  try {
    return new URL(href).host.replace(/^www\./, '');
  } catch {
    return href;
  }
}

function GalleryPlaceholder({ notes }: { notes: string[] }) {
  return (
    <div
      className="w-full aspect-video max-h-[380px] flex flex-col justify-between p-5"
      style={{
        background: 'linear-gradient(135deg, var(--surface) 0%, var(--accent-glow) 100%)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <span className="text-[var(--muted)] text-xs tracking-wide uppercase">Images</span>
      <ul className="space-y-1">
        {notes.slice(0, 2).map((note) => (
          <li key={note} className="text-sm text-[var(--text)] font-light">{note}</li>
        ))}
      </ul>
    </div>
  );
}

function TerminalMockup() {
  return (
    <div
      className="w-full aspect-video max-h-[380px] p-5 font-mono text-xs"
      style={{ background: '#0a0a0a', borderBottom: '1px solid var(--border)' }}
    >
      <p className="text-[var(--accent)]">$ nova</p>
      <p className="text-[var(--muted)] mt-1">offline · this machine</p>
    </div>
  );
}

export function ProjectCard({ project, framerEnabled, layout = 'stacked' }: ProjectCardProps) {
  const image = project.images && project.images.length > 0 ? (
    <img
      src={project.images[0].src}
      alt={project.images[0].alt}
      className="w-full aspect-video max-h-[380px] object-cover object-top"
      style={{ borderBottom: '1px solid var(--border)' }}
    />
  ) : project.imagePlaceholderType === 'gallery' ? (
    <GalleryPlaceholder notes={project.imageNotes} />
  ) : (
    <TerminalMockup />
  );

  const imageBlock = framerEnabled ? (
    <motion.div
      className="overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ boxShadow: 'none' }}
    >
      <div className="relative">
        {image}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-350 group-hover:opacity-100"
          style={{ background: 'radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  ) : (
    <div>{image}</div>
  );

  const meta = (
    <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
      <span>{project.category}</span>
      <span aria-hidden="true">·</span>
      <span>{project.status}</span>
    </div>
  );

  const title = (
    <h3 className="font-display font-bold text-[var(--text)] text-2xl lg:text-[1.85rem] leading-tight">
      {project.title}
    </h3>
  );

  const tagline = (
    <p className="text-[var(--text)] font-body font-light text-base leading-snug">
      {project.tagline}
    </p>
  );

  const techChips = project.techStack.length > 0 ? (
    <ul className="tech-list" aria-label="Tech stack">
      {project.techStack.map((tech) => (
        <li key={tech}>{tech}</li>
      ))}
    </ul>
  ) : null;

  const highlightsBlock = project.highlights.length > 0 ? (
    <ul className="space-y-2">
      {project.highlights.map((item) => (
        <li key={item} className="text-sm text-[var(--text)] flex gap-2 font-light">
          <span className="text-[var(--accent)] shrink-0" aria-hidden="true">—</span>
          {item}
        </li>
      ))}
    </ul>
  ) : null;

  const links = (
    <div className="flex flex-col gap-2 self-start">
      {project.href && (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover
          className="text-sm text-[var(--accent)] hover:underline"
        >
          {hostLabel(project.href)}
        </a>
      )}
      {project.repoUrl && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover
          className="text-sm text-[var(--accent)] hover:underline"
        >
          View Repository {project.repoLabel && <span className="text-[var(--muted)]">{project.repoLabel}</span>}
        </a>
      )}
    </div>
  );

  const point = (
    <div className="pt-6" style={{ borderTop: '1px solid var(--border)' }}>
      <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">What I&apos;d point to</p>
      <p className="text-sm text-[var(--muted)] leading-relaxed font-light">{project.pointTo}</p>
    </div>
  );

  const body = layout === 'split' ? (
    <div className="grid lg:grid-cols-[minmax(0,440px)_1fr] gap-10 lg:gap-14 items-start">
      <div className="flex flex-col gap-5">
        {imageBlock}
        {meta}
        {title}
        {tagline}
        {techChips}
      </div>
      <div className="flex flex-col gap-8 pt-1">
        {highlightsBlock}
        {project.stackNote && (
          <p className="text-sm text-[var(--muted)] font-light">{project.stackNote}</p>
        )}
        {links}
        {point}
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-6">
      {imageBlock}
      <div className="flex flex-col gap-4 px-1">
        {meta}
        {title}
        {tagline}
        {techChips}
        {highlightsBlock}
        {project.stackNote && (
          <p className="text-sm text-[var(--muted)] font-light">{project.stackNote}</p>
        )}
        {links}
        {point}
      </div>
    </div>
  );

  const cardClassName = layout === 'split'
    ? 'group rounded-none py-2 md:py-4'
    : 'group rounded-none';

  if (framerEnabled) {
    return (
      <motion.article
        data-cursor-hover
        className={cardClassName}
        style={{ background: 'transparent' }}
      >
        {body}
      </motion.article>
    );
  }

  return (
    <article
      data-cursor-hover
      className={cardClassName}
      style={{ background: 'transparent' }}
    >
      {body}
    </article>
  );
}
