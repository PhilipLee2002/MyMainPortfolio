'use client';

import { useReducer } from 'react';
import { motion } from 'framer-motion';
import type { ContactFormState } from '@/types';

type Action =
  | { type: 'SET_FIELD_ERROR'; field: keyof ContactFormState['errors']; message: string }
  | { type: 'CLEAR_ERROR'; field: keyof ContactFormState['errors'] }
  | { type: 'SUBMITTING' }
  | { type: 'SUCCESS' }
  | { type: 'ERROR'; message: string };

function reducer(state: ContactFormState, action: Action): ContactFormState {
  switch (action.type) {
    case 'SET_FIELD_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: action.message } };
    case 'CLEAR_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: undefined } };
    case 'SUBMITTING':
      return { status: 'loading', errors: {} };
    case 'SUCCESS':
      return { status: 'success', errors: {} };
    case 'ERROR':
      return { status: 'error', errors: { server: action.message } };
    default:
      return state;
  }
}

const initialState: ContactFormState = { status: 'idle', errors: {} };

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

interface ContactFormProps {
  contactEmailConfigured: boolean;
  framerEnabled: boolean;
}

export function ContactForm({ contactEmailConfigured, framerEnabled }: ContactFormProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  function validateName(value: string) {
    if (!value.trim()) dispatch({ type: 'SET_FIELD_ERROR', field: 'name', message: 'Name is required.' });
    else dispatch({ type: 'CLEAR_ERROR', field: 'name' });
  }

  function validateEmail(value: string) {
    if (!isValidEmail(value)) dispatch({ type: 'SET_FIELD_ERROR', field: 'email', message: 'Enter a valid email address.' });
    else dispatch({ type: 'CLEAR_ERROR', field: 'email' });
  }

  function validateMessage(value: string) {
    if (!value.trim()) dispatch({ type: 'SET_FIELD_ERROR', field: 'message', message: 'Message is required.' });
    else dispatch({ type: 'CLEAR_ERROR', field: 'message' });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name    = (form.elements.namedItem('name')    as HTMLInputElement).value;
    const email   = (form.elements.namedItem('email')   as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    // Run all validations first
    validateName(name);
    validateEmail(email);
    validateMessage(message);
    if (!name.trim() || !isValidEmail(email) || !message.trim()) return;

    dispatch({ type: 'SUBMITTING' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        dispatch({ type: 'SUCCESS' });
      } else {
        const data = await res.json();
        dispatch({ type: 'ERROR', message: data.error ?? 'Something went wrong. Please try again.' });
      }
    } catch {
      dispatch({ type: 'ERROR', message: 'Network error. Please check your connection and try again.' });
    }
  }

  if (state.status === 'success') {
    const SuccessWrapper = framerEnabled ? motion.div : 'div';
    return (
      <SuccessWrapper
        className="text-center py-12"
        {...(framerEnabled ? { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } } : {})}
      >
        <p className="text-4xl mb-4" aria-label="Success">✓</p>
        <p className="text-[var(--text)] font-medium text-lg">Message sent!</p>
        <p className="text-[var(--muted)] text-sm mt-2">Thanks for reaching out. I&apos;ll get back to you soon.</p>
      </SuccessWrapper>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {state.errors.server && (
        <p role="alert" className="text-red-400 text-sm p-3 rounded" style={{ background: 'var(--surface)' }}>
          {state.errors.server}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm text-[var(--muted)]">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          onBlur={(e) => validateName(e.target.value)}
          className="bg-[var(--surface)] border rounded px-4 py-3 text-[var(--text)] text-sm focus:outline-none focus:border-[var(--accent)]"
          style={{ borderColor: state.errors.name ? '#f87171' : 'var(--border)' }}
        />
        {state.errors.name && <p className="text-red-400 text-xs">{state.errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm text-[var(--muted)]">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          onBlur={(e) => validateEmail(e.target.value)}
          className="bg-[var(--surface)] border rounded px-4 py-3 text-[var(--text)] text-sm focus:outline-none focus:border-[var(--accent)]"
          style={{ borderColor: state.errors.email ? '#f87171' : 'var(--border)' }}
        />
        {state.errors.email && <p className="text-red-400 text-xs">{state.errors.email}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm text-[var(--muted)]">Message</label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={2000}
          rows={5}
          placeholder="Tell me about your project..."
          onBlur={(e) => validateMessage(e.target.value)}
          className="bg-[var(--surface)] border rounded px-4 py-3 text-[var(--text)] text-sm focus:outline-none focus:border-[var(--accent)] resize-none"
          style={{ borderColor: state.errors.message ? '#f87171' : 'var(--border)' }}
        />
        {state.errors.message && <p className="text-red-400 text-xs">{state.errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={!contactEmailConfigured || state.status === 'loading'}
        aria-label="Send message to Philip Lee"
        data-cursor-hover
        className="px-6 py-3 rounded font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        style={{ background: 'var(--accent)', color: 'var(--bg)' }}
      >
        {!contactEmailConfigured
          ? 'Contact unavailable'
          : state.status === 'loading'
          ? 'Sending…'
          : 'Send Message'}
      </button>
    </form>
  );
}
