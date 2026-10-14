import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { RoleSelector } from './components/RoleSelector';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { PWAInstallModal } from './components/PWAInstallModal';
import { DataResetModal } from './components/DataResetModal';

// Admin Views
import { AdminAnnouncementsView } from './views/admin/AdminAnnouncementsView';
import { AdminMenuView } from './views/admin/AdminMenuView';
import { AdminEventsView } from './views/admin/AdminEventsView';
import { AdminPaymentsView } from './views/admin/AdminPaymentsView';
import { AdminInvoicesView } from './views/admin/AdminInvoicesView';

// Parent Views
import { ParentAnnouncementsView } from './views/parent/ParentAnnouncementsView';
import { ParentMenuView } from './views/parent/ParentMenuView';
import { ParentEventsView } from './views/parent/ParentEventsView';
import { ParentPaymentsView } from './views/parent/ParentPaymentsView';
import { ParentInvoicesView } from './views/parent/ParentInvoicesView';

// Supporting Teacher / Student views
import { TeacherStudentView } from './views/other/TeacherStudentView';

const MainDashboard: React.FC = () => {
  const { currentRole, activeView, toastMessage } = useSchool();
  const [isPWAInstallOpen, setIsPWAInstallOpen] = useState(false);
  const [isDataResetOpen, setIsDataResetOpen] = useState(false);

  // If no role is selected, show initial clean role selector
  if (!currentRole) {
    return (
      <>
        <RoleSelector
          onOpenDataReset={() => setIsDataResetOpen(true)}
          onOpenPWAInstall={() => setIsPWAInstallOpen(true)}
        />
        <PWAInstallModal
          isOpen={isPWAInstallOpen}
          onClose={() => setIsPWAInstallOpen(false)}
        />
        <DataResetModal
          isOpen={isDataResetOpen}
          onClose={() => setIsDataResetOpen(false)}
        />
      </>
    );
  }

  // Render current view depending on role and activeView
  const renderCurrentView = () => {
    if (currentRole === 'teacher' || currentRole === 'student') {
      return <TeacherStudentView />;
    }

    if (currentRole === 'admin') {
      switch (activeView) {
        case 'announcements':
          return <AdminAnnouncementsView />;
        case 'menu':
          return <AdminMenuView />;
        case 'events':
          return <AdminEventsView />;
        case 'payments':
          return <AdminPaymentsView />;
        case 'invoices':
          return <AdminInvoicesView />;
        default:
          return <AdminAnnouncementsView />;
      }
    }

    if (currentRole === 'parent') {
      switch (activeView) {
        case 'announcements':
          return <ParentAnnouncementsView />;
        case 'menu':
          return <ParentMenuView />;
        case 'events':
          return <ParentEventsView />;
        case 'payments':
          return <ParentPaymentsView />;
        case 'invoices':
          return <ParentInvoicesView />;
        default:
          return <ParentAnnouncementsView />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Cabecera Institucional Unificada */}
      <Header
        onOpenDataReset={() => setIsDataResetOpen(true)}
        onOpenPWAInstall={() => setIsPWAInstallOpen(true)}
      />

      {/* Main Workspace: Desktop Sidebar + Viewport Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-24 lg:pb-8">
        {/* Menú Lateral Desplegable en Escritorio */}
        <Sidebar />

        {/* Viewport Content Area */}
        <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-8 min-w-0 w-full overflow-x-hidden">
          {renderCurrentView()}
        </main>
      </div>

      {/* Navegación Móvil y Tablet (Bottom Bar) */}
      <BottomNav />

      {/* PWA Install Modal */}
      <PWAInstallModal
        isOpen={isPWAInstallOpen}
        onClose={() => setIsPWAInstallOpen(false)}
      />

      {/* Data Reset & Supabase Readiness Modal */}
      <DataResetModal
        isOpen={isDataResetOpen}
        onClose={() => setIsDataResetOpen(false)}
      />

      {/* Global Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 max-w-sm bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200 border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-[#049643] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainDashboard />
    </SchoolProvider>
  );
}
