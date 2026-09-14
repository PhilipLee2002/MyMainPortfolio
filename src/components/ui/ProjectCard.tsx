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

// max-h caps the image's height independent of the card's own width — without
// it, aspect-video alone lets the image balloon (e.g. ~590px tall on a wide
// card) and dwarf the rest of the card's content.
function GradientPlaceholder() {
  return (
    <div
      className="w-full aspect-video max-h-[380px] flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, var(--surface) 0%, var(--accent-glow) 100%)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* REPLACE WITH FRACA SCREENSHOT */}
      <span className="text-[var(--muted)] text-xs tracking-wide uppercase">Project preview</span>
    </div>
  );
}

function TerminalMockup() {
  return (
    <div
      className="w-full aspect-video max-h-[380px] p-5 font-mono text-xs"
      style={{ background: '#0a0a0a', borderBottom: '1px solid var(--border)' }}
    >
      {/* REPLACE WITH NOVA SCREENSHOT */}
      <p className="text-green-400">$ nova</p>
      <p className="text-[var(--muted)] mt-1">Nova Terminal AI — ready</p>
    </div>
  );
}

export function ProjectCard({ project, framerEnabled, layout = 'stacked' }: ProjectCardProps) {
  const image = project.imagePlaceholderType === 'gradient'
    ? <GradientPlaceholder />
    : <TerminalMockup />;

  const imageBlock = framerEnabled ? (
    <motion.div
      className="overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ boxShadow: 'none' }}
    >
      <div className="relative">
        {image}
        {/* Subtle accent glow on hover via group — applied as overlay sibling */}
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
      <span>{project.year}</span>
    </div>
  );

  const title = (
    <h3 className="font-display font-bold text-[var(--text)] text-2xl lg:text-[1.85rem] leading-tight">
      {project.title}
    </h3>
  );

  const headlineOutcome = project.outcomeMetrics[0] ? (
    <p className="text-[var(--accent)] font-body font-medium text-base leading-snug">
      {project.outcomeMetrics[0]}
    </p>
  ) : null;

  const techChips = (
    <ul className="tech-list" aria-label="Tech stack">
      {project.techStack.map((tech) => (
        <li key={tech}>{tech}</li>
      ))}
    </ul>
  );

  const featuresBlock = (
    <div>
      <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-3">Features</p>
      <ul className="space-y-2">
        {project.features.map((f) => (
          <li key={f} className="text-sm text-[var(--text)] flex gap-2 font-light">
            <span className="text-[var(--accent)] shrink-0" aria-hidden="true">—</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );

  const outcomesBlock = (
    <div>
      <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-3">Outcomes</p>
      <ul className="space-y-2">
        {project.outcomeMetrics.map((m) => (
          <li key={m} className="text-sm text-[var(--accent)] font-light">{m}</li>
        ))}
      </ul>
    </div>
  );

  const repoLink = project.repoUrl && (
    <a
      href={project.repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor-hover
      className="text-sm text-[var(--accent)] hover:underline self-start"
    >
      View Repository {project.repoLabel && <span className="text-[var(--muted)]">{project.repoLabel}</span>}
    </a>
  );

  const reflectionBlock = project.reflectionText && (
    <div className="pt-6" style={{ borderTop: '1px solid var(--border)' }}>
      <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">Reflection</p>
      <p className="text-sm text-[var(--muted)] leading-relaxed font-light">{project.reflectionText}</p>
    </div>
  );

  const body = layout === 'split' ? (
    <div className="grid lg:grid-cols-[minmax(0,440px)_1fr] gap-10 lg:gap-14 items-start">
      {/* Left — media + identity */}
      <div className="flex flex-col gap-5">
        {imageBlock}
        {meta}
        {title}
        {headlineOutcome}
        {techChips}
      </div>

      {/* Right — detail */}
      <div className="flex flex-col gap-8 pt-1">
        {featuresBlock}
        {outcomesBlock}
        {repoLink}
        {reflectionBlock}
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-6">
      {imageBlock}
      <div className="flex flex-col gap-4 px-1">
        {meta}
        {title}
        {headlineOutcome}
        {techChips}
        {featuresBlock}
        {outcomesBlock}
        {repoLink}
        {reflectionBlock}
      </div>
    </div>
  );

  const cardClassName = layout === 'split'
    ? 'group rounded-none py-2 md:py-4'
    : 'group rounded-none';

  // Soften whole-card scale — editorial surface, media zoom only
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
