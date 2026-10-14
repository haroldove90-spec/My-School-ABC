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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#000000] border-t border-neutral-800 lg:hidden shadow-2xl safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 min-h-[48px] rounded-xl transition-all relative ${
                isActive
                  ? 'bg-neutral-900/80 font-bold'
                  : 'hover:bg-neutral-900/40 text-neutral-300'
              }`}
            >
              {/* Active top line indicator */}
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-[#0694E8] rounded-full shadow-[0_0_8px_#0694E8]" />
              )}

              <div className="relative">
                {/* Icons are ALWAYS white as requested */}
                <Icon className={`w-5 h-5 text-white ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#D32421] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] mt-1 tracking-tight truncate max-w-[62px] ${
                  isActive ? 'text-[#0694E8] font-bold' : 'text-neutral-300'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
