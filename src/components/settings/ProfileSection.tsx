'use client';

import { useAuthStore } from '@/stores/authStore';
import { User, Globe } from 'lucide-react';

export default function ProfileSection() {
  const user = useAuthStore((s) => s.user);

  return (
    <section className="glass rounded-2xl p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
        <User size={16} className="text-accent" />
        Profile
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-text-muted">Name</p>
            <p className="text-sm text-text">{user?.name || 'Not set'}</p>
          </div>
          <button className="text-[11px] text-accent hover:text-accent/80 transition-colors">
            Edit
          </button>
        </div>

        <div className="border-t border-white/5" />

        <div>
          <p className="text-xs text-text-muted">Email</p>
          <p className="text-sm text-text">{user?.email || 'Not set'}</p>
        </div>

        <div className="border-t border-white/5" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-text-muted" />
            <div>
              <p className="text-xs text-text-muted">Language</p>
              <p className="text-sm text-text">
                {user?.language || 'English'}
              </p>
            </div>
          </div>
          <button className="text-[11px] text-accent hover:text-accent/80 transition-colors">
            Change
          </button>
        </div>
      </div>
    </section>
  );
}
