import { render, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { ContactForm } from '../ContactForm';

describe('ContactForm validation', () => {
  it('rejects whitespace-only name on blur (P3)', () => {
    fc.assert(fc.property(fc.stringMatching(/^\s+$/), (whitespace) => {
      cleanup(); // each property iteration renders fresh; avoid accumulating DOM across runs
      const { getByLabelText, getByText } = render(
        <ContactForm contactEmailConfigured framerEnabled={false} />
      );
      const input = getByLabelText(/name/i) as HTMLInputElement;
      fireEvent.change(input, { target: { value: whitespace } });
      fireEvent.blur(input);
      expect(() => getByText(/name is required/i)).not.toThrow();
    }));
  }, 20000);

  it('rejects invalid email formats on blur (P4)', () => {
    const invalidEmails = fc.oneof(
      fc.string({ maxLength: 10 }).filter((s) => !s.includes('@')),
      fc.constant('@nodomain'),
      fc.constant('noatsign'),
      fc.constant('double@@at.com'),
    );
    fc.assert(fc.property(invalidEmails, (bad) => {
      cleanup();
      const { getByLabelText, getByText } = render(
        <ContactForm contactEmailConfigured framerEnabled={false} />
      );
      const input = getByLabelText(/email/i) as HTMLInputElement;
      fireEvent.change(input, { target: { value: bad } });
      fireEvent.blur(input);
      expect(() => getByText(/valid email/i)).not.toThrow();
    }));
  }, 20000);
});
