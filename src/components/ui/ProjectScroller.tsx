'use client';

import { useEffect, useRef } from 'react';
import type { Project } from '@/types';
import { PROJECT_STAGES } from '@/lib/projects';
import { CaseStudy } from '@/components/ui/CaseStudy';

interface ProjectScrollerProps {
  projects: Project[];
  framerEnabled: boolean;
}

const NAV_OFFSET = 64;

function panelTravel(content: HTMLElement | null, viewport: number) {
  if (!content) return 0;
  return Math.max(0, content.offsetHeight - viewport);
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/** Zero slope at both ends, so a sideways move starts and settles instead of kicking. */
function easeInOut(t: number) {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

function easeOut(t: number) {
  const x = clamp01(t);
  return 1 - (1 - x) * (1 - x);
}

interface ScrollMetrics {
  width: number;
  travels: number[];
  /** Scroll distance spent gliding to the next project. */
  slide: number;
  /** How much of each project's vertical travel happens during that glide. */
  handoffs: number[];
  total: number;
}

function measure(pin: HTMLElement, nodes: (HTMLElement | null)[]): ScrollMetrics {
  const width = pin.clientWidth;
  const travels = nodes.map((node) => panelTravel(node, pin.clientHeight));
  const slide = Math.round(Math.max(width * 0.8, 1));
  const handoffs = travels.map((travel, index) =>
    index === travels.length - 1 ? 0 : Math.min(320, travel, slide * 0.42),
  );
  const total = travels.reduce((sum, travel, index) => {
    const pure = Math.max(0, travel - handoffs[index]);
    const glide = index === travels.length - 1 ? 0 : slide;
    return sum + pure + glide;
  }, 0);
  return { width, travels, slide, handoffs, total };
}

export function ProjectScroller({ projects, framerEnabled }: ProjectScrollerProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const pin = pinRef.current;
    const row = rowRef.current;
    if (!pin || !row) return;

    let cancelled = false;
    let trigger: { kill: () => void } | undefined;

    const run = async () => {
      try {
        const { default: gsap } = await import('gsap');
        const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        let metrics = measure(pin, contentRefs.current);

        const place = (progress: number) => {
          const nodes = contentRefs.current;
          const { width, travels, slide, handoffs, total } = metrics;
          if (total <= 0 || width <= 0) return;

          let remaining = progress * total;
          const ys = travels.map(() => 0);
          let x = 0;
          let glideFrom = -1;
          let glideU = 0;

          for (let i = 0; i < travels.length; i++) {
            const travel = travels[i];
            const handoff = handoffs[i];
            const pure = Math.max(0, travel - handoff);
            const isLast = i === travels.length - 1;

            if (remaining <= pure || isLast) {
              ys[i] = -Math.min(remaining, travel);
              x = -i * width;
              break;
            }

            remaining -= pure;

            if (remaining <= slide) {
              const u = slide <= 0 ? 1 : remaining / slide;
              const vertical = easeOut(Math.min(1, u / 0.62));
              ys[i] = -(pure + handoff * vertical);
              x = -(i + easeInOut(u)) * width;
              glideFrom = i;
              glideU = easeInOut(u);
              break;
            }

            remaining -= slide;
            ys[i] = -travel;
            x = -(i + 1) * width;
          }

          gsap.set(row, { x, force3D: true });
          nodes.forEach((node, i) => {
            if (!node) return;
            let opacity = 1;
            if (glideFrom === i) opacity = 1 - 0.14 * glideU;
            if (glideFrom === i - 1) opacity = 0.86 + 0.14 * glideU;
            gsap.set(node, { y: ys[i], force3D: true });
            if (node.parentElement) gsap.set(node.parentElement, { opacity });
          });
        };

        trigger = ScrollTrigger.create({
          trigger: pin,
          start: `top ${NAV_OFFSET}px`,
          end: () => {
            metrics = measure(pin, contentRefs.current);
            return `+=${metrics.total}`;
          },
          pin: true,
          anticipatePin: 0,
          // Lenis already eases the wheel. A second scrub delay makes the
          // panels lag behind the scroll and stutter at the sideways handoff.
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => place(self.progress),
        });

        const refresh = () => ScrollTrigger.refresh();
        pin.querySelectorAll('img').forEach((img) => {
          if (!img.complete) img.addEventListener('load', refresh, { once: true });
        });
      } catch (err) {
        console.warn('[ProjectScroller] GSAP setup failed:', err);
      }
    };

    run();

    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, [projects.length]);

  return (
    <div
      ref={pinRef}
      className="overflow-hidden"
      style={{ height: `calc(100vh - ${NAV_OFFSET}px)` }}
    >
      <div
        ref={rowRef}
        className="flex h-full will-change-transform"
        style={{ width: `${projects.length * 100}%` }}
      >
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="h-full overflow-hidden shrink-0"
            style={{ width: `${100 / projects.length}%` }}
          >
            <div
              ref={(node) => {
                contentRefs.current[index] = node;
              }}
              className="px-6 sm:px-10"
            >
              <div className="max-w-[1200px] mx-auto pt-8 pb-20">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)] mb-6">
                  {PROJECT_STAGES.find((stage) => stage.id === project.stage)?.label}
                </p>
                <CaseStudy
                  project={project}
                  index={index}
                  density="full"
                  framerEnabled={framerEnabled}
                  reveal={false}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
