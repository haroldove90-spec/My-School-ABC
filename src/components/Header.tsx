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
          icon: <ShieldCheck className="w-4 h-4 text-[#0694E8]" />,
          bg: 'bg-blue-50 text-[#0694E8] border-blue-200',
        };
      case 'parent':
        return {
          label: 'Padre de Familia (Papás)',
          sub: 'Alumno: Mateo Sánchez (Primaria 1°A)',
          icon: <Users className="w-4 h-4 text-[#049643]" />,
          bg: 'bg-emerald-50 text-[#049643] border-emerald-200',
        };
      case 'teacher':
        return {
          label: 'Docente / Maestro',
          icon: <BookOpen className="w-4 h-4 text-[#D32421]" />,
          bg: 'bg-red-50 text-[#D32421] border-red-200',
        };
      case 'student':
        return {
          label: 'Alumno / Estudiante',
          icon: <GraduationCap className="w-4 h-4 text-slate-800" />,
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
        };
      default:
        return {
          label: 'Invitado',
          icon: null,
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  const roleInfo = getRoleDetails();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Logotipo del sistema */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center">
            <img
              src="https://appdesignproyectos.com/myschoollogo.png"
              alt="My School ABC"
              className="h-9 sm:h-10 w-auto object-contain"
              onError={(e) => {
                // Fallback text branding if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="sr-only">My School ABC</span>
          </div>

          {/* Active Role Identification */}
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleInfo.bg}`}
            >
              {roleInfo.icon}
              <span className="whitespace-nowrap">{roleInfo.label}</span>
            </div>
            {roleInfo.sub && (
              <span className="hidden xl:inline text-xs text-slate-500 font-medium truncate max-w-xs">
                {roleInfo.sub}
              </span>
            )}
          </div>
        </div>

        {/* Right action group */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile role indicator pill */}
          <div
            className={`sm:hidden flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${roleInfo.bg}`}
          >
            {roleInfo.icon}
            <span className="truncate max-w-[110px]">
              {currentRole === 'admin' ? 'Admin' : currentRole === 'parent' ? 'Padre' : roleInfo.label}
            </span>
          </div>

          {/* Botón de Borrar Datos de Muestra / Base de Datos */}
          <button
            onClick={onOpenDataReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
            title="Borrar datos de muestra / Configurar Supabase"
          >
            <Database className="w-3.5 h-3.5 text-[#D32421]" />
            <span className="hidden md:inline">
              {isSampleDisabled ? 'Base Limpia' : 'Datos Muestra'}
            </span>
          </button>

          {/* Botón de Instalación Rápida PWA */}
          {(!isInstalled && (isInstallable || isIOS)) && (
            <button
              onClick={onOpenPWAInstall}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0694E8] hover:bg-[#0582cd] rounded-lg shadow-xs transition"
              title="Instalar My School ABC en este dispositivo"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instalar App</span>
              <span className="sm:hidden">Instalar</span>
            </button>
          )}

          {/* Botón de Cierre de Sesión */}
          <button
            onClick={() => setCurrentRole(null)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-[#D32421] hover:bg-red-50 border border-slate-200 rounded-lg transition"
            title="Cerrar sesión y cambiar de rol"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
