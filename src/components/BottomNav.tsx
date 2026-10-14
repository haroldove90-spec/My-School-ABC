import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { Bell, Utensils, Calendar, CreditCard, FileText } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const BottomNav: React.FC = () => {
  const { currentRole, activeView, setActiveView, paymentConcepts } = useSchool();

  const adminNav: NavItem[] = [
    { id: 'announcements', label: 'Avisos', icon: Bell },
    { id: 'menu', label: 'Menú', icon: Utensils },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'payments', label: 'Cobranza', icon: CreditCard },
    { id: 'invoices', label: 'Facturas', icon: FileText },
  ];

  const parentNav: NavItem[] = [
    { id: 'announcements', label: 'Avisos', icon: Bell },
    { id: 'menu', label: 'Menú', icon: Utensils },
    { id: 'events', label: 'Eventos', icon: Calendar },
    {
      id: 'payments',
      label: 'Pagos',
      icon: CreditCard,
      badge: paymentConcepts.filter((c) => c.status === 'pendiente').length || undefined,
    },
    { id: 'invoices', label: 'Factura', icon: FileText },
  ];

  const navItems = currentRole === 'admin' ? adminNav : parentNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 lg:hidden shadow-lg safe-bottom">
      <div className="flex items-center justify-around h-15 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 min-h-[48px] rounded-lg transition-colors relative ${
                isActive
                  ? 'text-[#0694E8] font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#D32421] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-[64px]">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-[#0694E8] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
