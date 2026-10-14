import React from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  Bell,
  Utensils,
  Calendar,
  CreditCard,
  FileText,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Users,
  Building,
} from 'lucide-react';

interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { currentRole, activeView, setActiveView, setCurrentRole, announcements, events, paymentConcepts, transactions } = useSchool();

  const adminNav: SidebarNavItem[] = [
    {
      id: 'announcements',
      label: 'Muro de Avisos',
      icon: Bell,
      badge: announcements.length ? `${announcements.length}` : undefined,
    },
    {
      id: 'menu',
      label: 'Menú del Comedor',
      icon: Utensils,
    },
    {
      id: 'events',
      label: 'Gestión de Eventos',
      icon: Calendar,
      badge: events.length ? `${events.length}` : undefined,
    },
    {
      id: 'payments',
      label: 'Control de Cobranza',
      icon: CreditCard,
      badge: transactions.length ? `${transactions.length}` : undefined,
    },
    {
      id: 'invoices',
      label: 'Gestión de Facturación',
      icon: FileText,
    },
  ];

  const parentNav: SidebarNavItem[] = [
    {
      id: 'announcements',
      label: 'Avisos de Grupo',
      icon: Bell,
      badge: announcements.length ? `${announcements.length}` : undefined,
    },
    {
      id: 'menu',
      label: 'Menú Escolar',
      icon: Utensils,
    },
    {
      id: 'events',
      label: 'Eventos del Colegio',
      icon: Calendar,
    },
    {
      id: 'payments',
      label: 'Pasarela de Pagos',
      icon: CreditCard,
      badge: paymentConcepts.filter(c => c.status === 'pendiente').length ? `${paymentConcepts.filter(c => c.status === 'pendiente').length}` : undefined,
      badgeColor: 'bg-[#D32421] text-white',
    },
    {
      id: 'invoices',
      label: 'Autofacturación',
      icon: FileText,
    },
  ];

  const navItems = currentRole === 'admin' ? adminNav : parentNav;

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-[#000000] border-r border-neutral-800 shrink-0 min-h-[calc(100vh-4rem)]">
      {/* School identity mini-card */}
      <div className="p-4 border-b border-neutral-800 bg-neutral-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center p-1.5 shadow-xs shrink-0">
            <Building className="w-5 h-5 text-white" />
          </div>
          <div className="overflow-hidden">
            <h2 className="text-xs font-bold text-white truncate">Colegio My School ABC</h2>
            <p className="text-[11px] text-neutral-400 truncate">Ciclo Escolar 2026 - 2027</p>
          </div>
        </div>
      </div>

      {/* Module Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          Módulos del Sistema
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-[#0694E8] text-white shadow-xs font-semibold'
                  : 'text-neutral-200 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-white shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {!isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom role switch info & session */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-950 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-400">Sesión iniciada:</span>
          <span className="font-semibold text-white">
            {currentRole === 'admin' ? 'Administrador' : 'Padre de Familia'}
          </span>
        </div>

        <button
          onClick={() => setCurrentRole(null)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 hover:text-red-300 border border-neutral-700/80 rounded-lg transition"
        >
          <LogOut className="w-3.5 h-3.5 text-white" />
          <span>Cambiar de Rol</span>
        </button>
      </div>
    </aside>
  );
};
