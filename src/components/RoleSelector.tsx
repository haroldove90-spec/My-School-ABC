import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { RoleId } from '../types';
import { ShieldCheck, Users, GraduationCap, BookOpen, Download, Database, RotateCcw } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface RoleSelectorProps {
  onOpenDataReset: () => void;
  onOpenPWAInstall: () => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  onOpenDataReset,
  onOpenPWAInstall,
}) => {
  const { setCurrentRole, isSampleDisabled } = useSchool();
  const { isInstallable, isIOS, isInstalled } = usePWAInstall();

  const roles: {
    id: RoleId;
    title: string;
    icon: React.ReactNode;
    color: string;
    hoverBorder: string;
  }[] = [
    {
      id: 'admin',
      title: 'Administrador / Escuela',
      icon: <ShieldCheck className="w-10 h-10 text-[#0694E8]" />,
      color: 'bg-blue-50/70 border-slate-200 group-hover:border-[#0694E8]',
      hoverBorder: 'hover:border-[#0694E8] hover:shadow-md',
    },
    {
      id: 'parent',
      title: 'Padre de Familia (Papás)',
      icon: <Users className="w-10 h-10 text-[#049643]" />,
      color: 'bg-emerald-50/70 border-slate-200 group-hover:border-[#049643]',
      hoverBorder: 'hover:border-[#049643] hover:shadow-md',
    },
    {
      id: 'teacher',
      title: 'Docente / Maestro',
      icon: <BookOpen className="w-10 h-10 text-[#D32421]" />,
      color: 'bg-red-50/70 border-slate-200 group-hover:border-[#D32421]',
      hoverBorder: 'hover:border-[#D32421] hover:shadow-md',
    },
    {
      id: 'student',
      title: 'Alumno / Estudiante',
      icon: <GraduationCap className="w-10 h-10 text-slate-800" />,
      color: 'bg-slate-100/70 border-slate-200 group-hover:border-slate-800',
      hoverBorder: 'hover:border-slate-800 hover:shadow-md',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 md:p-10">
      {/* Top minimal status bar */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        {(!isInstalled && (isInstallable || isIOS)) ? (
          <button
            onClick={onOpenPWAInstall}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#0694E8]" />
            <span>Instalar App</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={onOpenDataReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition shadow-xs"
          title="Gestión de datos de muestra y preparación para Supabase"
        >
          <Database className="w-3.5 h-3.5 text-[#D32421]" />
          <span>{isSampleDisabled ? 'Base Limpia (Supabase)' : 'Datos de Muestra'}</span>
        </button>
      </div>

      {/* Main role selector container */}
      <div className="max-w-5xl mx-auto w-full my-auto py-8">
        {/* Institutional Logo - Clean, centered */}
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <div className="w-48 sm:w-56 md:w-64 mb-3 flex items-center justify-center">
            <img
              src="https://appdesignproyectos.com/myschoollogo.png"
              alt="My School ABC"
              className="max-h-20 w-auto object-contain drop-shadow-xs"
              onError={(e) => {
                // Fallback if network blocked
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
            Portal Institucional Escolar
          </span>
        </div>

        {/* Cuadrícula 2 Columnas Móvil / 4 Columnas Escritorio: Solo nombre del rol y el logo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setCurrentRole(role.id)}
              className={`group flex flex-col items-center justify-center p-5 sm:p-7 md:p-8 bg-white border border-slate-200 rounded-xl transition-all duration-200 text-center cursor-pointer ${role.hoverBorder}`}
            >
              {/* Logo / Emblema del rol */}
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105 ${role.color}`}
              >
                {role.icon}
              </div>

              {/* Nombre del rol */}
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-slate-950 transition-colors">
                {role.title}
              </h2>
            </button>
          ))}
        </div>
      </div>

      {/* Footer minimal info */}
      <footer className="text-center text-xs text-slate-400 py-4 max-w-5xl mx-auto w-full">
        <span>My School ABC · Plataforma de Gestión Educativa · PWA Instalable</span>
      </footer>
    </div>
  );
};
