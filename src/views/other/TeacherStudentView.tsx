import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { BookOpen, GraduationCap, ArrowRight, ShieldCheck, Users } from 'lucide-react';

export const TeacherStudentView: React.FC = () => {
  const { currentRole, setCurrentRole } = useSchool();
  const isTeacher = currentRole === 'teacher';

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-white border border-slate-200 shadow-xs">
        {isTeacher ? (
          <BookOpen className="w-8 h-8 text-[#D32421]" />
        ) : (
          <GraduationCap className="w-8 h-8 text-slate-800" />
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-xl font-bold text-slate-900">
          {isTeacher ? 'Portal del Docente / Maestro' : 'Portal del Alumno / Estudiante'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          {isTeacher
            ? 'Bienvenido al panel docente. Desde aquí puedes coordinar tareas, revisar asistencia y redactar comunicados que la dirección autoriza.'
            : 'Bienvenido a tu espacio de estudiante. Consulta tu horario escolar, tareas asignadas y menús saludables del día.'}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-left text-xs space-y-4">
        <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
          Acceso Rápido a los Roles Principales:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setCurrentRole('admin')}
            className="flex items-center justify-between p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 transition group text-left"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#0694E8]" />
              <div>
                <span className="font-bold text-slate-900 block">Administrador / Escuela</span>
                <span className="text-[10px] text-slate-500">Avisos, Menú, Eventos, Cobranza</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#0694E8] group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setCurrentRole('parent')}
            className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 transition group text-left"
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#049643]" />
              <div>
                <span className="font-bold text-slate-900 block">Padre de Familia</span>
                <span className="text-[10px] text-slate-500">Pasarela Pagos, Menú, Factura</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#049643] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
