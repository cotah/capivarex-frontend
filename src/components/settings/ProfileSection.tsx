'use client';
import { useT } from '@/i18n';
import { useState } from 'react';
import { User, Globe, Check, X, Pencil } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/lib/api';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
];

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (val: string) => Promise<void>;
  type?: string;
  placeholder?: string;
}

function EditableField({ label, value, onSave, type = 'text', placeholder }: EditableFieldProps) {
  const t = useT();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (draft === value) { setEditing(false); return; }
    setSaving(true);
    try {
      await onSave(draft);
      setEditing(false);
    } catch {
      setDraft(value);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-muted">{label}</p>
        {editing ? (
          <input
            autoFocus
            type={type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
            placeholder={placeholder}
            className="mt-0.5 w-full bg-white/5 border border-accent/30 rounded-lg px-2 py-1 text-base text-text outline-none focus:border-accent/60 transition-colors"
          />
        ) : (
          <p className="text-base text-text truncate">{value || <span className="text-text-muted/50 italic">{t('common.not_set')}</span>}</p>
        )}
      </div>
      {editing ? (
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={handleSave} disabled={saving} className="p-1.5 rounded-lg bg-accent/15 text-accent hover:bg-accent/25 transition-colors disabled:opacity-50">
            <Check size={14} />
          </button>
          <button onClick={() => { setDraft(value); setEditing(false); }} className="p-1.5 rounded-lg bg-white/5 text-text-muted hover:text-text transition-colors">
            <X size={14} />
          </button>
        </div>
      ) : (
        <button onClick={() => { setDraft(value); setEditing(true); }} className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/5 transition-colors shrink-0">
          <Pencil size={14} />
        </button>
      )}
    </div>
  );
}

export default function ProfileSection() {
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);

  const updateField = async (field: string, value: string) => {
    await apiClient('/api/webapp/user/profile', {
      method: 'PATCH',
      body: JSON.stringify({ [field]: value }),
    });
    await refreshUser();
  };

  const [lang, setLang] = useState(user?.language || 'en');
  const [savingLang, setSavingLang] = useState(false);

  const handleLangChange = async (code: string) => {
    setLang(code);
    setSavingLang(true);
    try {
      await apiClient('/api/webapp/user/profile', {
        method: 'PATCH',
        body: JSON.stringify({ language: code }),
      });
      await refreshUser();
    } catch {
      setLang(user?.language || 'en');
    } finally {
      setSavingLang(false);
    }
  };

  return (
    <section className="glass rounded-2xl p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-base font-semibold text-text">
        <User size={16} className="text-accent" />
        Profile
      </h3>
      <div className="space-y-4">
        <EditableField
          label="Name"
          value={user?.name || ''}
          placeholder="Your name"
          onSave={(v) => updateField('name', v)}
        />
        <div className="border-t border-white/5" />
        <div>
          <p className="text-sm text-text-muted">{t('settings.email')}</p>
          <p className="text-base text-text">{user?.email || 'Not set'}</p>
        </div>
        <div className="border-t border-white/5" />
        <EditableField
          label="Phone number"
          value={user?.phone_number || ''}
          placeholder="+5511999999999"
          type="tel"
          onSave={(v) => updateField('phone_number', v)}
        />
        <div className="border-t border-white/5" />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-text-muted" />
            <p className="text-sm text-text-muted">{t('settings.language')}</p>
          </div>
          <select
            value={lang}
            onChange={(e) => handleLangChange(e.target.value)}
            disabled={savingLang}
            className="bg-white/5 border border-glass-border rounded-lg px-2 py-1 text-sm text-text outline-none focus:border-accent/40 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-[#0a0a0f]">
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
