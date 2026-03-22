'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function HelpPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center space-y-4">
        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl text-primary">
            help_center
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-primary">
          Help & Support
        </h1>
        <p className="text-secondary max-w-md">
          This is a placeholder page. Documentation, tutorials, and support contact options will be shown here.
        </p>
      </div>
    </DashboardLayout>
  );
}
