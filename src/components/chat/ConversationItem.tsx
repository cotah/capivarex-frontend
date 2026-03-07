'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Pencil, Trash2, Check, X } from 'lucide-react';
import { useConversationStore } from '@/stores/conversationStore';
import { useChatStore } from '@/stores/chatStore';

interface ConversationItemProps {
  id: string;
  title: string;
  active: boolean;
  onSelect: () => void;
}

export default function ConversationItem({ id, title, active, onSelect }: ConversationItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(title);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const renameRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const renameConversation = useConversationStore((s) => s.renameConversation);
  const deleteConversation = useConversationStore((s) => s.deleteConversation);
  const activeConversationId = useConversationStore((s) => s.activeConversationId);

  useEffect(() => {
    if (isRenaming) renameRef.current?.focus();
  }, [isRenaming]);

  /* Close menu on outside click */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setConfirmDelete(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handleRenameSubmit = () => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== title) {
      renameConversation(id, trimmed);
    } else {
      setRenameValue(title);
    }
    setIsRenaming(false);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    deleteConversation(id);
    if (activeConversationId === id) {
      useChatStore.setState({ messages: [], isThinking: false });
    }
    setMenuOpen(false);
    setConfirmDelete(false);
  };

  if (isRenaming) {
    return (
      <div className="flex items-center gap-1 rounded-lg px-3 py-2">
        <input
          ref={renameRef}
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRenameSubmit();
            if (e.key === 'Escape') { setIsRenaming(false); setRenameValue(title); }
          }}
          className="flex-1 bg-transparent text-sm text-text outline-none border-b border-accent/40"
        />
        <button onClick={handleRenameSubmit} className="text-success hover:text-success/80 p-1">
          <Check size={14} />
        </button>
        <button onClick={() => { setIsRenaming(false); setRenameValue(title); }} className="text-text-muted hover:text-text p-1">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className={`group relative ${menuOpen ? 'z-[999]' : 'z-0'}`}>
      <button
        onClick={onSelect}
        className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors duration-150 ${
          active
            ? 'bg-accent-soft text-accent'
            : 'text-text-muted hover:bg-white/5 hover:text-text'
        }`}
      >
        <span className="truncate">{title}</span>
      </button>

      {/* Three-dot menu — visible on hover */}
      <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" ref={menuRef}>
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); setConfirmDelete(false); }}
          className="flex h-6 w-6 items-center justify-center rounded text-text-muted hover:text-text hover:bg-white/10"
        >
          <MoreHorizontal size={14} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 z-50 w-36 rounded-lg glass-strong py-1 shadow-xl">
            <button
              onClick={(e) => { e.stopPropagation(); setIsRenaming(true); setMenuOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-white/5"
            >
              <Pencil size={13} /> Rename
            </button>
            {!confirmDelete ? (
              <button
                onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-error/80 hover:text-error hover:bg-white/5"
              >
                <Trash2 size={13} /> Delete
              </button>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-error font-medium hover:bg-error/10"
              >
                <Trash2 size={13} /> Are you sure?
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
