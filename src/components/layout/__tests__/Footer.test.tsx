import { render } from '@testing-library/react';
import { Footer } from '../Footer';
import { describe, it, expect } from 'vitest';

describe('Footer — social links', () => {
  it('every social link has a matching aria-label, target=_blank, and rel=noopener noreferrer', () => {
    const { container } = render(<Footer />);
    const links = Array.from(container.querySelectorAll('a[target="_blank"]'));

    expect(links.length).toBeGreaterThan(0);

    links.forEach((link) => {
      const label = link.getAttribute('aria-label') ?? '';
      expect(label).toMatch(/^Visit Philip Lee's .+ profile$/);

      expect(link.getAttribute('target')).toBe('_blank');

      const rel = link.getAttribute('rel') ?? '';
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
    });
  });
});
