'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * TopNavBar — Desktop top navigation bar.
 * Shows the BookIt brand, navigation links, Share Link button, and user avatar.
 * Matches the Stitch design: bg-[#faf9fd], max-w-7xl centered, sticky top.
 */
export default function TopNavBar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const navLinks = [
    { label: 'Schedule', href: '/' },
    { label: 'Bookings', href: '/bookings' },
    { label: 'Availability', href: '/availability' },
    { label: 'Analytics', href: '/analytics' },
  ];

  const handleShareLink = () => {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    navigator.clipboard.writeText(`${url}/book/${user?.id || 'demo'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <nav className="bg-[#faf9fd] flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto sticky top-0 z-50">
      {/* Brand */}
      <div className="text-xl font-bold tracking-tighter text-[#002147]">
        BookIt
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center space-x-8 font-medium tracking-tight text-sm">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`transition-colors duration-200 ${
                isActive ? 'text-[#002147] font-bold' : 'text-slate-500 hover:text-[#002147]'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button 
          onClick={handleShareLink}
          className="bg-primary-container text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
        >
          {copied ? (
            <>
              <span className="material-symbols-outlined text-sm">check</span>
              Copied!
            </>
          ) : (
            'Share Link'
          )}
        </button>
        {user?.avatarUrl ? (
          <img
            alt="User profile avatar"
            className="w-10 h-10 rounded-lg object-cover"
            src={user.avatarUrl}
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">
              person
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}
