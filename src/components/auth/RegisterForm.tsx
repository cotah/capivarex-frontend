'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { register } from '@/lib/auth';
import { Eye, EyeOff, UserPlus, Phone } from 'lucide-react';
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional().refine(
    (val) => !val || val.replace(/[\s\-\(\)]/g, '').length >= 7,
    'Phone number too short'
  ),
});

const COUNTRY_CODES = [
  { code: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: '+353', flag: '🇮🇪', name: 'Ireland' },
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: '+34', flag: '🇪🇸', name: 'Spain' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: '+31', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+52', flag: '🇲🇽', name: 'Mexico' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
];

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+353');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullPhone = phone ? `${countryCode}${phone.replace(/[\s\-\(\)]/g, '')}` : undefined;

    const result = registerSchema.safeParse({ name, email, password, phone: fullPhone });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name, email, password, fullPhone);
      toast.success('Account created!');
      router.push('/pricing');
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-base text-text placeholder:text-text-muted/50 outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm text-text-muted mb-1.5">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
          className={inputClass}
        />
      </div>

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
          className={inputClass}
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm text-text-muted mb-1.5">
          <span className="flex items-center gap-1.5">
            <Phone size={13} />
            Phone
            <span className="text-text-muted/50 text-xs">(recommended)</span>
          </span>
        </label>
        <div className="flex gap-2">
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="w-[110px] rounded-xl bg-white/5 border border-white/10 px-2 py-2.5 text-sm text-text outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-colors appearance-none"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="89 123 4567"
            autoComplete="tel"
            className={`flex-1 ${inputClass}`}
          />
        </div>
        <p className="text-xs text-text-muted/50 mt-1">
          Get Capivarex on WhatsApp & Telegram
        </p>
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm text-text-muted mb-1.5"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            className={`${inputClass} pr-10 text-sm`}
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
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-base font-medium text-bg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-accent/20"
      >
        {isSubmitting ? (
          <div className="h-4 w-4 rounded-full border-2 border-bg/30 border-t-bg animate-spin" />
        ) : (
          <>
            <UserPlus size={16} />
            Create Account
          </>
        )}
      </button>

      {/* Login link */}
      <p className="text-center text-sm text-text-muted">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-accent hover:text-accent/80 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
