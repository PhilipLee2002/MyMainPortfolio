import { render, cleanup } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { ProjectCard } from '../ProjectCard';
import type { Project } from '@/types';

// Non-blank text: RTL's getByText normalizes (trims/collapses) whitespace before
// matching, so a whitespace-only string can never be matched against rendered output.
const nonBlankString = (constraints?: fc.StringConstraints) =>
  fc.string({ minLength: 1, ...constraints }).filter((s) => s.trim().length > 0);

const arbProject = fc.record<Project>({
  id:                  nonBlankString(),
  title:               nonBlankString(),
  category:            nonBlankString(),
  weight:              fc.constantFrom('featured' as const, 'compact' as const),
  tagline:             nonBlankString(),
  status:              nonBlankString(),
  problem:             nonBlankString(),
  contributionLabel:   nonBlankString(),
  contribution:        nonBlankString(),
  highlights:          fc.array(nonBlankString(), { minLength: 1 }),
  techStack:           fc.array(nonBlankString(), { minLength: 1 }),
  pointTo:             nonBlankString(),
  imageNotes:          fc.array(nonBlankString(), { minLength: 1 }),
  imagePlaceholderType: fc.constantFrom('gallery' as const, 'terminal' as const),
  href:                fc.option(fc.webUrl(), { nil: undefined }),
  role:                fc.option(nonBlankString(), { nil: undefined }),
  stackNote:           fc.option(nonBlankString(), { nil: undefined }),
  repoUrl:             fc.option(fc.webUrl(), { nil: undefined }),
  repoLabel:           fc.option(fc.string(), { nil: undefined }),
});

describe('ProjectCard', () => {
  it('always renders category, all tech stack and highlight items (P1)', () => {
    fc.assert(fc.property(arbProject, (project) => {
      cleanup(); // each property iteration renders fresh; avoid accumulating DOM across runs
      const { container } = render(
        <ProjectCard project={project} framerEnabled={false} />
      );
      // Plain substring check on textContent: RTL's getByText/getAllByText normalize and
      // whitespace-trim both the query and the DOM text before comparing, which produces
      // false negatives/positives when generated fields collide or contain edge-case
      // whitespace. A raw substring check matches the property's actual intent — the
      // value appears somewhere in the rendered output — without that indirection.
      const text = container.textContent ?? '';
      expect(text).toContain(project.category);
      project.techStack.forEach((t) => expect(text).toContain(t));
      project.highlights.forEach((item) => expect(text).toContain(item));
    }));
  }, 20000);

  it('only shows repo link when repoUrl is defined (P2)', () => {
    fc.assert(fc.property(arbProject, (project) => {
      cleanup();
      const { container } = render(
        <ProjectCard project={project} framerEnabled={false} />
      );
      const links = Array.from(container.querySelectorAll('a[href]'));
      const repoLinks = links.filter((a) => a.getAttribute('href') === project.repoUrl);
      if (project.repoUrl) {
        expect(repoLinks.length).toBeGreaterThan(0);
      } else {
        expect(repoLinks.length).toBe(0);
      }
    }));
  }, 20000);
});
