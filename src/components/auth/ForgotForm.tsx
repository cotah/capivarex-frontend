'use client';
import { useT } from '@/i18n';

import { useState } from 'react';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { forgotPassword } from '@/lib/auth';
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

export default function ForgotForm() {
  const t = useT();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = forgotSchema.safeParse({ email });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);

    try {
      await forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent! Check your email.');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Request failed. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 mx-auto">
          <Mail size={24} className="text-accent" />
        </div>
        <p className="text-sm text-text">{t('auth.check_email')}</p>
        <p className="text-sm text-text-muted">
          We sent a password reset link to <strong className="text-text">{email}</strong>
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-text-muted text-center">
        Enter your email and we will send you a reset link.
      </p>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm text-text-muted mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-text placeholder:text-text-muted/50 outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-colors"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-medium text-bg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-accent/20"
      >
        {isSubmitting ? (
          <div className="h-4 w-4 rounded-full border-2 border-bg/30 border-t-bg animate-spin" />
        ) : (
          'Send Reset Link'
        )}
      </button>

      {/* Back to login */}
      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>
      </div>
    </form>
  );
}
