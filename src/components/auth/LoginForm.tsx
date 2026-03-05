'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { login } from '@/lib/auth';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email, password);
      toast.success('Welcome back!');
      router.push('/');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Login failed. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs text-text-muted mb-1.5">
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

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-xs text-text-muted mb-1.5"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 pr-10 text-sm text-text placeholder:text-text-muted/50 outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
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
          <>
            <LogIn size={16} />
            Sign In
          </>
        )}
      </button>

      {/* Forgot password */}
      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-xs text-text-muted hover:text-accent transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-white/10" />
        <span className="text-[10px] text-text-muted uppercase tracking-wider">
          or
        </span>
        <div className="flex-1 border-t border-white/10" />
      </div>

      {/* Google OAuth (future) */}
      <button
        type="button"
        disabled
        className="w-full flex items-center justify-center gap-2 rounded-xl glass py-2.5 text-sm text-text-muted cursor-not-allowed"
      >
        Continue with Google
        <span className="text-[10px] bg-white/5 rounded px-1.5 py-0.5">
          Soon
        </span>
      </button>

      {/* Register link */}
      <p className="text-center text-xs text-text-muted">
        {"Don't have an account? "}
        <Link
          href="/register"
          className="text-accent hover:text-accent/80 transition-colors"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
