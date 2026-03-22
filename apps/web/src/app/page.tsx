'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import TopNavBar from '@/components/layout/TopNavBar';
import SideNavBar from '@/components/layout/SideNavBar';
import BottomNavBar from '@/components/layout/BottomNavBar';
import ProfileSection from '@/components/booking/ProfileSection';
import BookingWidget from '@/components/booking/BookingWidget';

/**
 * Main booking page — the primary view of BookIt.
 * 
 * Layout structure (matching Stitch desktop design):
 * ┌──────────────────────────────────────────────┐
 * │ TopNavBar                                     │
 * ├──────┬───────────────────────────────────────┤
 * │      │  ┌─────────────┬─────────────────────┐│
 * │ Side │  │ Profile     │ Booking Widget       ││
 * │ Nav  │  │ Section     │ (Calendar + Slots)   ││
 * │      │  └─────────────┴─────────────────────┘│
 * └──────┴───────────────────────────────────────┘
 * 
 * On mobile:
 * - SideNav hidden
 * - Profile stacks above widget
 * - BottomNavBar appears
 */
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show nothing while checking auth
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 skeleton-shimmer rounded-full mx-auto" />
          <div className="h-4 w-32 skeleton-shimmer rounded mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left Column: Profile */}
        <ProfileSection />

        {/* Right Column: Booking Widget */}
        <BookingWidget />
      </div>
    </DashboardLayout>
  );
}
