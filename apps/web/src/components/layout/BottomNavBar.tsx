'use client';

import Link from 'next/link';

/**
 * BottomNavBar — Mobile bottom navigation.
 * Visible only on mobile (md:hidden). Shows Home, Book, Schedule, Profile tabs.
 * Uses glassmorphism with backdrop-blur and rounded top corners.
 */
export default function BottomNavBar() {
  const navItems = [
    { icon: 'home', label: 'Home', active: true },
    { icon: 'add_circle', label: 'Book', active: false },
    { icon: 'event_note', label: 'Schedule', active: false },
    { icon: 'person', label: 'Profile', active: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-8 pt-4 md:hidden bg-white/70 backdrop-blur-xl border-t border-slate-100 shadow-[0_-12px_40px_rgba(0,0,0,0.06)] rounded-t-3xl">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href="#"
          className={`flex flex-col items-center justify-center p-2 transition-all active:scale-90 ${
            item.active
              ? 'bg-[#002147] text-white rounded-2xl w-16 h-12 scale-90'
              : 'text-slate-400'
          }`}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
