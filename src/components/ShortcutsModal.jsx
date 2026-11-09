import React from 'react';
import { Keyboard, X } from 'lucide-react';

const SHORTCUTS = [
  { key: 'F', desc: '4K Fullscreen' },
  { key: 'Space', desc: 'Play / Pause' },
  { key: 'M', desc: 'Mute / Unmute' },
  { key: 'H', desc: 'Hide Controls' },
  { key: '1 - 6', desc: 'Switch Fireplaces' },
  { key: 'C', desc: 'Clock Overlay' },
  { key: 'B', desc: 'Breathing Guide' },
  { key: 'Esc', desc: 'Close Dialogs' },
];

export default function ShortcutsModal({ onClose }) {
  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-orange-400" />
          <h3 className="text-base font-cinzel font-semibold text-amber-200 tracking-wide">
            Keyboard Shortcuts
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {SHORTCUTS.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5 text-xs"
          >
            <span className="text-stone-300 text-[11px] truncate">{item.desc}</span>
            <kbd className="px-2 py-0.5 rounded-md bg-stone-900 border border-orange-500/20 text-orange-300 font-mono text-[10px] font-semibold">
              {item.key}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
}
