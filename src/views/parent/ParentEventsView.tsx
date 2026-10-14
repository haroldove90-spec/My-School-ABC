import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Calendar, MapPin, Clock, Tag, Check, CheckCircle2 } from 'lucide-react';

export const ParentEventsView: React.FC = () => {
  const { events, showToast } = useSchool();
  const [confirmedEvents, setConfirmedEvents] = useState<string[]>([]);

  // Filter events relevant for the child's group or all groups
  const parentEvents = events.filter(
    (ev) => ev.targetGroup === 'Todos los grupos' || ev.targetGroup === 'Primaria 1°A'
  );

  const toggleConfirm = (id: string, title: string) => {
    if (confirmedEvents.includes(id)) {
      setConfirmedEvents((prev) => prev.filter((item) => item !== id));
      showToast(`Confirmación cancelada para: ${title}`);
    } else {
      setConfirmedEvents((prev) => [...prev, id]);
      showToast(`¡Asistencia confirmada para: ${title}!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Calendario de Eventos Escolares
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Actividades, festivales cívicos y fechas importantes para tu familia
          </p>
        </div>
      </div>

      {/* Events Grid */}
      {parentEvents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-900">No hay eventos próximos</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Por el momento no hay actividades cívicas o juntas programadas en el calendario.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parentEvents.map((ev) => {
            const isConfirmed = confirmedEvents.includes(ev.id);
            return (
              <div
                key={ev.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[#0694E8] border border-blue-200">
                      {ev.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {ev.targetGroup}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">{ev.description}</p>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#0694E8] shrink-0" />
                      <span className="font-mono tabular-nums font-semibold">{ev.date}</span>
                      <span className="text-slate-400">·</span>
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{ev.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#D32421] shrink-0" />
                      <span>{ev.location}</span>
                    </div>

                    {ev.dressCode && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>Vestimenta requerida: {ev.dressCode}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  {ev.requiresConfirmation ? (
                    <button
                      onClick={() => toggleConfirm(ev.id, ev.title)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        isConfirmed
                          ? 'bg-emerald-50 text-[#049643] border border-emerald-200'
                          : 'bg-[#0694E8] text-white hover:bg-[#0582cd]'
                      }`}
                    >
                      {isConfirmed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Asistencia Confirmada</span>
                        </>
                      ) : (
                        <>
                          <span>Confirmar mi Asistencia</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">Entrada libre a familias</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
