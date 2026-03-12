import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <p className="text-7xl font-bold text-accent/20">404</p>
        <h2 className="text-xl font-semibold text-text">Page not found</h2>
        <p className="text-sm text-text-muted max-w-xs">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
      <Link
        href="/chat"
        className="flex items-center gap-2 rounded-xl bg-accent/10 px-5 py-2.5 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
      >
        <Home size={14} />
        Go to Chat
      </Link>
    </div>
  );
}
