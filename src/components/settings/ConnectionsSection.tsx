'use client';

import { Plug, Circle } from 'lucide-react';

interface Connection {
  name: string;
  icon: string;
  connected: boolean;
}

const connections: Connection[] = [
  { name: 'Google Calendar', icon: '📅', connected: true },
  { name: 'Spotify', icon: '🎵', connected: true },
  { name: 'SmartThings', icon: '🏠', connected: false },
  { name: 'GitHub', icon: '🐙', connected: false },
];

export default function ConnectionsSection() {
  return (
    <section className="glass rounded-2xl p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
        <Plug size={16} className="text-accent" />
        Connections
      </h3>

      <div className="space-y-0">
        {connections.map((conn, i) => (
          <div key={conn.name}>
            {i > 0 && <div className="my-3 border-t border-white/5" />}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{conn.icon}</span>
                <div>
                  <p className="text-sm text-text">{conn.name}</p>
                  <div className="flex items-center gap-1.5">
                    <Circle
                      size={6}
                      className={
                        conn.connected
                          ? 'fill-success text-success'
                          : 'fill-text-muted text-text-muted'
                      }
                    />
                    <span className="text-[11px] text-text-muted">
                      {conn.connected ? 'Connected' : 'Not connected'}
                    </span>
                  </div>
                </div>
              </div>
              {!conn.connected && (
                <button className="rounded-lg bg-accent/10 px-3 py-1.5 text-[11px] font-medium text-accent hover:bg-accent/20 transition-colors">
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
