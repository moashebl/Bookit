'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { login as apiLogin, register as apiRegister, ApiError } from '@/lib/api';

/**
 * Login page — Split-screen authentication layout.
 *
 * Design matches the Stitch Login_page export exactly:
 * - LEFT (60%): Full-height hero image with dark overlay + tagline
 * - RIGHT (40%): Login form with brand, inputs, social buttons, sign-up link
 *
 * Palette overrides for this page:
 * - Background: cream (#fdfbf7) instead of the app background
 * - Accent: yellow (#ffde3e) for the Sign Up pill
 * - Rounded-full Sign In button
 */
export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let response;
      if (isRegister) {
        response = await apiRegister(email, password, name);
      } else {
        response = await apiLogin(email, password);
      }

      setUser(response.user);
      router.push('/');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#fdfbf7] text-[#002147] min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* ================================================================
          LEFT PANEL — Hero Image
          Hidden on mobile. Shows architect workspace photo with overlay + tagline.
          ================================================================ */}
      <div className="hidden md:block md:w-1/2 lg:w-3/5 relative overflow-hidden">
        <img
          alt="Architect working in a bright modern office"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBslcFMjmFAyPQw5XrWcob4Lvpb6x6XDvCmEVjKGekRo2LZwLmKKq7WIO3_zF9DJTZo0XzjYNBRx9PdpteHqtNPunj2mq6QMjqRmPAGCliNmVxWP9Fx8L7lMkbp3E3uxGu9vGOOQ8JIzf5go15iCI-GP_wZJmbvcUywOXqmrSd5Aofv4mZyKjc4uqS40cupBSKs-gg0w3J1WiO9R1O4DlJnaZm1Yk24jTwHYmSq8i_QDMleK3Kkz8knwl_UrUnKklSGLUHJrYN48Q"
        />
        {/* Dark blue overlay */}
        <div className="absolute inset-0 bg-[#002147]/20 mix-blend-multiply" />

        {/* Tagline at bottom */}
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Precision scheduling for visionary architects.
          </h2>
          <p className="text-lg font-medium text-white/90">
            Join the world&apos;s leading firms in mastering time and design.
          </p>
        </div>
      </div>

      {/* ================================================================
          RIGHT PANEL — Login Form
          Full width on mobile, 40% on desktop.
          ================================================================ */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center p-8 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Brand */}
          <div className="mb-10 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-[#002147] rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white">
                  architecture
                </span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-[#002147]">
                BookIt
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#002147] mb-2">
              {isRegister ? 'Create account' : 'Welcome back'}
            </h1>
            <p className="text-[#5c5f60] font-medium text-sm">
              {isRegister
                ? 'Sign up to start managing your bookings.'
                : 'Log in to manage your precision architectural schedule.'}
            </p>
          </div>

          {/* Form Area */}
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-[#ffdad6]/30 rounded-lg border border-[#ba1a1a]/10">
                <p className="text-[#ba1a1a] text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name (register only) */}
              {isRegister && (
                <div>
                  <label
                    className="block text-[11px] font-bold tracking-widest uppercase text-[#5c5f60] mb-1.5 px-0.5"
                    htmlFor="name"
                  >
                    Full Name
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-white border border-[#c4c6cf]/50 rounded-lg text-[#002147] placeholder:text-[#c4c6cf] focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] transition-all text-sm outline-none"
                    id="name"
                    name="name"
                    placeholder="Alex Carter"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  className="block text-[11px] font-bold tracking-widest uppercase text-[#5c5f60] mb-1.5 px-0.5"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className="w-full px-4 py-3 bg-white border border-[#c4c6cf]/50 rounded-lg text-[#002147] placeholder:text-[#c4c6cf] focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] transition-all text-sm outline-none"
                  id="email"
                  name="email"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5 px-0.5">
                  <label
                    className="block text-[11px] font-bold tracking-widest uppercase text-[#5c5f60]"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  {!isRegister && (
                    <a
                      className="text-xs font-semibold text-[#002147] hover:underline transition-colors"
                      href="#"
                    >
                      Forgot?
                    </a>
                  )}
                </div>
                <input
                  className="w-full px-4 py-3 bg-white border border-[#c4c6cf]/50 rounded-lg text-[#002147] placeholder:text-[#c4c6cf] focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] transition-all text-sm outline-none"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {/* Sign In / Sign Up Button — rounded-full pill */}
              <button
                className={`w-full py-4 bg-[#002147] hover:bg-[#002147]/90 rounded-full text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-[#002147]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">
                      progress_activity
                    </span>
                    {isRegister ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : isRegister ? (
                  'Create Account'
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* ── Divider: OR CONTINUE WITH ── */}
            <div className="relative py-4">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#c4c6cf]/30" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="bg-[#fdfbf7] px-4 text-[#c4c6cf]">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-white border border-[#c4c6cf]/50 hover:bg-[#fdfbf7] transition-colors rounded-lg group">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-xs font-bold text-[#002147]">Google</span>
              </button>
              <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-white border border-[#c4c6cf]/50 hover:bg-[#fdfbf7] transition-colors rounded-lg group">
                <span className="material-symbols-outlined text-[18px] text-[#002147]">
                  terminal
                </span>
                <span className="text-xs font-bold text-[#002147]">GitHub</span>
              </button>
            </div>

            {/* Toggle sign-up / sign-in */}
            <div className="pt-6 text-center">
              <p className="text-sm font-medium text-[#5c5f60]">
                {isRegister ? 'Already have an account?' : 'New to BookIt?'}
                <button
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setError('');
                  }}
                  className="inline-block px-4 py-1.5 ml-2 bg-[#ffde3e] hover:bg-[#ffde3e]/90 text-[#002147] font-bold rounded-full transition-all text-xs"
                >
                  {isRegister ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>

            {/* Demo Credentials Hint */}
            {!isRegister && (
              <div className="p-3 bg-[#d6e3ff]/20 rounded-lg text-center">
                <p className="text-xs text-[#2d476f] font-medium">
                  Demo: <span className="font-bold">demo@bookit.com</span> /{' '}
                  <span className="font-bold">password123</span>
                </p>
              </div>
            )}
          </div>

          {/* Footer Links */}
          <footer className="mt-20 flex justify-center md:justify-start space-x-4 text-[10px] font-bold uppercase tracking-widest text-[#c4c6cf]">
            <a className="hover:text-[#002147] transition-colors" href="#">
              Privacy
            </a>
            <a className="hover:text-[#002147] transition-colors" href="#">
              Terms
            </a>
            <a className="hover:text-[#002147] transition-colors" href="#">
              Support
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}
