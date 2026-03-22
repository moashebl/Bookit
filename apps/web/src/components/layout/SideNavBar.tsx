'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import NewEventModal from '@/components/booking/NewEventModal';

/**
 * SideNavBar — Desktop sidebar navigation.
 * Hidden on mobile (hidden md:flex). Shows BookIt branding,
 * nav items with Material icons, "+ New Event" CTA, and footer links.
 * Uses surface-container background with no explicit borders (design system rule).
 */
export default function SideNavBar() {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { icon: 'calendar_today', label: 'Calendar', href: '/' },
    { icon: 'group', label: 'Mentors', href: '/clients' },
    { icon: 'settings', label: 'Settings', href: '/settings' },
  ];

  return (
    <>
      <aside className="hidden md:flex flex-col h-full w-64 p-4 space-y-2 bg-[#efedf1] sticky top-20 self-start rounded-r-3xl">
        {/* Brand Header */}
        <div className="px-4 py-6 mb-4">
          <div className="text-lg font-black text-[#002147]">BookIt</div>
          <div className="text-xs text-secondary font-medium uppercase tracking-widest opacity-70">
            The Precision Architect
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-transform active:translate-x-1 ${
                  isActive
                    ? 'bg-white text-[#002147] shadow-sm'
                    : 'text-slate-500 hover:bg-white/50'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* New Event Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-8 mx-2 bg-primary-container text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Event
        </button>

        {/* Footer Links */}
        <div className="pt-8 mt-auto border-t border-outline-variant/10 space-y-1">
          <Link
            href="/help"
            className="flex items-center gap-3 p-3 text-slate-500 hover:bg-white/50 rounded-lg"
          >
            <span className="material-symbols-outlined">help_outline</span>
            <span className="font-semibold text-sm">Help</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 p-3 text-slate-500 hover:bg-white/50 rounded-lg w-full"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>
      
      <NewEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
