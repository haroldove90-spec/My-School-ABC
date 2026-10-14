import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  LogOut,
  Download,
  Database,
  ShieldCheck,
  Users,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

interface HeaderProps {
  onOpenDataReset: () => void;
  onOpenPWAInstall: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDataReset, onOpenPWAInstall }) => {
  const { currentRole, setCurrentRole, isSampleDisabled } = useSchool();
  const { isInstallable, isIOS, isInstalled } = usePWAInstall();

  const getRoleDetails = () => {
    switch (currentRole) {
      case 'admin':
        return {
          label: 'Administrador / Escuela',
          icon: <ShieldCheck className="w-4 h-4 text-white" />,
          bg: 'bg-blue-950/80 text-blue-200 border-blue-600/50',
        };
      case 'parent':
        return {
          label: 'Padre de Familia (Papás)',
          sub: 'Alumno: Mateo Sánchez (Primaria 1°A)',
          icon: <Users className="w-4 h-4 text-white" />,
          bg: 'bg-emerald-950/80 text-emerald-200 border-emerald-600/50',
        };
      case 'teacher':
        return {
          label: 'Docente / Maestro',
          icon: <BookOpen className="w-4 h-4 text-white" />,
          bg: 'bg-red-950/80 text-red-200 border-red-600/50',
        };
      case 'student':
        return {
          label: 'Alumno / Estudiante',
          icon: <GraduationCap className="w-4 h-4 text-white" />,
          bg: 'bg-neutral-800 text-neutral-200 border-neutral-700',
        };
      default:
        return {
          label: 'Invitado',
          icon: null,
          bg: 'bg-neutral-800 text-neutral-200 border-neutral-700',
        };
    }
  };

  const roleInfo = getRoleDetails();

  return (
    <header className="sticky top-0 z-30 bg-[#000000] border-b border-neutral-800 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Logotipo del sistema */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="flex items-center bg-white px-2 py-1 rounded-lg shadow-xs">
            <img
              src="https://appdesignproyectos.com/myschoollogo.png"
              alt="My School ABC"
              className="h-7 sm:h-8 md:h-9 w-auto object-contain"
              onError={(e) => {
                // Fallback text branding if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="sr-only">My School ABC</span>
          </div>

          {/* Active Role Identification (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-neutral-800">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleInfo.bg}`}
            >
              {roleInfo.icon}
              <span className="whitespace-nowrap">{roleInfo.label}</span>
            </div>
            {roleInfo.sub && (
              <span className="hidden xl:inline text-xs text-neutral-400 font-medium truncate max-w-xs">
                {roleInfo.sub}
              </span>
            )}
          </div>
        </div>

        {/* Right action group */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Mobile role indicator pill */}
          <div
            className={`sm:hidden flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${roleInfo.bg}`}
          >
            {roleInfo.icon}
            <span className="truncate max-w-[85px]">
              {currentRole === 'admin' ? 'Admin' : currentRole === 'parent' ? 'Padre' : roleInfo.label}
            </span>
          </div>

          {/* Botón de Borrar Datos de Muestra / Base de Datos */}
          <button
            onClick={onOpenDataReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-lg transition"
            title="Borrar datos de muestra / Configurar Supabase"
          >
            <Database className="w-3.5 h-3.5 text-white" />
            <span className="hidden md:inline">
              {isSampleDisabled ? 'Base Limpia' : 'Datos Muestra'}
            </span>
          </button>

          {/* Botón de Instalación Rápida PWA */}
          {(!isInstalled && (isInstallable || isIOS)) && (
            <button
              onClick={onOpenPWAInstall}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-[#0694E8] hover:bg-[#0582cd] border border-blue-400/40 rounded-lg shadow-xs transition"
              title="Instalar My School ABC en este dispositivo"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Instalar App</span>
              <span className="sm:hidden">Instalar</span>
            </button>
          )}

          {/* Botón de Cierre de Sesión */}
          <button
            onClick={() => setCurrentRole(null)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-red-950/80 hover:text-red-200 border border-neutral-700/80 rounded-lg transition"
            title="Cerrar sesión y cambiar de rol"
          >
            <LogOut className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
