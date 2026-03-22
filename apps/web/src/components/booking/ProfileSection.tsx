'use client';

import { useAuth } from '@/lib/auth-context';

/**
 * ProfileSection — User profile card.
 * Displays avatar (rounded), name (bold black tracking-tight),
 * title, bio, and social icon links.
 * On desktop: left-aligned. On mobile: centered.
 */
export default function ProfileSection() {
  const { user } = useAuth();

  // Fallback values for the demo
  const name = user?.name || 'Alex Carter';
  const title = user?.title || 'Senior Product Designer';
  const bio =
    user?.bio ||
    'Passionate about building intuitive digital experiences and mentoring early-career designers. Specializing in high-end editorial interfaces and precision systems.';
  const avatarUrl =
    user?.avatarUrl ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDc-wNDBAh0042iYNIBujRess92P8u_JoGXaR31fQGYnHMlTyctiq9aIfwuJZKxTDQXq6evWeX4pEWQJTPA6vPaxD2C04KBsbFUlvjVa_65hvrafFyyWw3j6sqae53OKIoqxJzPDEE398HXEohRiPb6wv1_gFikx61AsR_jjOs3r2Rfd3hmjWxt5qeixDGIxEiDMqbx0XCS3ruliqp5Iw9NdF2CL9gpDs-zZxDfPv9gvqq0vevHJteO7Lfg8_5uhOBRD-bSpVCYGA';

  return (
    <section className="lg:col-span-5 space-y-8">
      {/* Avatar — Desktop: large circle. Mobile: rounded square with verified badge */}
      <div className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-2xl border-4 border-white mx-auto lg:mx-0">
        <img
          alt={`${name} Profile`}
          className="w-full h-full object-cover"
          src={avatarUrl}
        />
      </div>

      {/* Name & Title */}
      <div className="space-y-4 text-center lg:text-left">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-primary">
          {name}
        </h1>
        <p className="text-xl font-semibold text-on-primary-container">
          {title}
        </p>
        <p className="text-secondary leading-relaxed text-lg max-w-md mx-auto lg:mx-0">
          {bio}
        </p>
      </div>

      {/* Social Links */}
      <div className="flex items-center gap-6 justify-center lg:justify-start">
        <a
          href="#"
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container hover:bg-primary hover:text-white transition-all duration-300"
        >
          <span className="material-symbols-outlined">link</span>
        </a>
        <a
          href="#"
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container hover:bg-primary hover:text-white transition-all duration-300"
        >
          <span className="material-symbols-outlined">share</span>
        </a>
        <a
          href="#"
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container hover:bg-primary hover:text-white transition-all duration-300"
        >
          <span className="material-symbols-outlined">public</span>
        </a>
      </div>
    </section>
  );
}
