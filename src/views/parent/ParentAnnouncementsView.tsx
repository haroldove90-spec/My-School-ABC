import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Bell, Lock, Paperclip, Clock, AlertCircle } from 'lucide-react';

export const ParentAnnouncementsView: React.FC = () => {
  const { announcements, showToast } = useSchool();

  // Filter announcements for the student's group: 'Primaria 1°A' or 'Todos los grupos'
  const parentAnnouncements = announcements.filter(
    (ann) => ann.group === 'Todos los grupos' || ann.group === 'Primaria 1°A'
  );

  const handleDownloadAttachment = (name: string) => {
    showToast(`Descargando documento institucional: ${name}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Canal de Avisos del Grupo
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Avisos dirigidos a Primaria 1°A · Alumno: Mateo Sánchez Morales
          </p>
        </div>
      </div>

      {/* Solo Lectura Institutional Notice Banner */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
        <div className="p-2 bg-white rounded-lg text-slate-600 border border-slate-200 shrink-0">
          <Lock className="w-4 h-4 text-slate-700" />
        </div>
        <div className="text-xs text-slate-600">
          <span className="font-bold text-slate-900 block text-xs">
            Canal Informativo en Modo Solo Lectura
          </span>
          <p className="mt-0.5 leading-relaxed">
            Este canal es exclusivamente de carácter informativo oficial emitido por la Dirección y Docentes de My School ABC. Las respuestas se encuentran deshabilitadas para mantener el tablón limpio y libre de saturación de mensajes. Para dudas directas, acude al departamento escolar.
          </p>
        </div>
      </div>

      {/* Announcements Stream */}
      {parentAnnouncements.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-900">No hay avisos recientes</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Por el momento no hay comunicados pendientes para el grupo de tu hijo.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {parentAnnouncements.map((ann) => {
            const isUrg = ann.priority === 'urgente';
            const isImp = ann.priority === 'importante';

            return (
              <div
                key={ann.id}
                className={`bg-white rounded-xl border p-5 shadow-xs transition ${
                  isUrg
                    ? 'border-red-300 bg-red-50/20'
                    : isImp
                    ? 'border-amber-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-[#0694E8] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                      {ann.group}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 font-mono tabular-nums flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {ann.date}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{ann.author}</span>
                  </div>

                  {isUrg && (
                    <span className="text-[11px] font-bold text-[#D32421] bg-red-50 px-2 py-0.5 rounded-full border border-red-200 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Urgente
                    </span>
                  )}
                  {isImp && (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Importante
                    </span>
                  )}
                </div>

                {/* Title & Body */}
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {ann.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-4">
                  {ann.content}
                </p>

                {/* Attachment if present */}
                {ann.hasAttachment && ann.attachmentName && (
                  <div className="pt-2">
                    <button
                      onClick={() => handleDownloadAttachment(ann.attachmentName!)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-[#0694E8]" />
                      <span>{ann.attachmentName}</span>
                      <span className="text-[10px] text-slate-400 font-normal">(Descargar PDF)</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
