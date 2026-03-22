'use client';

import { ReactNode } from 'react';
import TopNavBar from './TopNavBar';
import SideNavBar from './SideNavBar';
import BottomNavBar from './BottomNavBar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <TopNavBar />
      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        <SideNavBar />
        <main className="flex-1 p-8 md:p-12 lg:p-16 pb-28 md:pb-16 overflow-x-hidden">
          {children}
        </main>
      </div>
      <BottomNavBar />
    </>
  );
}
