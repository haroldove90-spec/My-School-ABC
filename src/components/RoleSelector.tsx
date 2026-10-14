import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { RoleId } from '../types';
import { ShieldCheck, Users, GraduationCap, BookOpen, Download, Database } from 'lucide-react';
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
  }[] = [
    {
      id: 'admin',
      title: 'Administrador / Escuela',
      icon: <ShieldCheck className="w-12 h-12 sm:w-14 sm:h-14 text-white" />,
    },
    {
      id: 'parent',
      title: 'Padre de Familia (Papás)',
      icon: <Users className="w-12 h-12 sm:w-14 sm:h-14 text-white" />,
    },
    {
      id: 'teacher',
      title: 'Docente / Maestro',
      icon: <BookOpen className="w-12 h-12 sm:w-14 sm:h-14 text-white" />,
    },
    {
      id: 'student',
      title: 'Alumno / Estudiante',
      icon: <GraduationCap className="w-12 h-12 sm:w-14 sm:h-14 text-white" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between p-4 sm:p-6 md:p-10">
      {/* Top minimal status bar */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        {(!isInstalled && (isInstallable || isIOS)) ? (
          <button
            onClick={onOpenPWAInstall}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 border border-neutral-700/80 rounded-lg hover:bg-neutral-800 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Instalar App</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={onOpenDataReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 border border-neutral-700/80 rounded-lg hover:bg-neutral-800 transition shadow-xs"
          title="Gestión de datos de muestra y preparación para Supabase"
        >
          <Database className="w-3.5 h-3.5 text-white" />
          <span>{isSampleDisabled ? 'Base Limpia (Supabase)' : 'Datos de Muestra'}</span>
        </button>
      </div>

      {/* Main role selector container */}
      <div className="max-w-5xl mx-auto w-full my-auto py-8">
        {/* Institutional Logo - Sin encapsular, tamaño original sobre fondo #000000 */}
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <img
            src="https://appdesignproyectos.com/myschoollogo.png"
            alt="My School ABC"
            className="h-28 sm:h-32 md:h-36 w-auto object-contain mb-3"
            onError={(e) => {
              // Fallback if network blocked
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
            Portal Institucional Escolar
          </span>
        </div>

        {/* Cuadrícula 2 Columnas Móvil / 4 Columnas Escritorio: Sin encapsular íconos, íconos blancos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setCurrentRole(role.id)}
              className="group flex flex-col items-center justify-center p-6 sm:p-8 bg-neutral-900 border border-neutral-800 hover:border-[#0694E8] rounded-2xl transition-all duration-200 text-center cursor-pointer hover:bg-neutral-850 hover:shadow-xl"
            >
              {/* Ícono de acceso sin encapsular, en color blanco */}
              <div className="mb-4 text-white transition-transform duration-200 group-hover:scale-110 flex items-center justify-center">
                {role.icon}
              </div>

              {/* Nombre del rol en blanco */}
              <h2 className="text-sm sm:text-base font-semibold text-white transition-colors">
                {role.title}
              </h2>
            </button>
          ))}
        </div>
      </div>

      {/* Footer minimal info */}
      <footer className="text-center text-xs text-neutral-500 py-4 max-w-5xl mx-auto w-full">
        <span>My School ABC · Plataforma de Gestión Educativa · PWA Instalable</span>
      </footer>
    </div>
  );
};
