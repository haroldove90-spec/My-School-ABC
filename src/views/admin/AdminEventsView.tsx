import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolEvent, SchoolGroup } from '../../types';
import { Calendar, Plus, Trash2, MapPin, Clock, Users, X, Tag } from 'lucide-react';

const SCHOOL_GROUPS: SchoolGroup[] = [
  'Todos los grupos',
  'Maternal A',
  'Kinder 1',
  'Kinder 2',
  'Kinder 3',
  'Primaria 1°A',
  'Primaria 2°A',
  'Primaria 3°B',
  'Primaria 4°A',
  'Primaria 5°A',
  'Primaria 6°A',
  'Secundaria 1°A',
  'Secundaria 2°B',
  'Secundaria 3°A',
];

export const AdminEventsView: React.FC = () => {
  const { events, addEvent, deleteEvent } = useSchool();
  const [isCreating, setIsCreating] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [targetGroup, setTargetGroup] = useState<SchoolGroup>('Todos los grupos');
  const [dressCode, setDressCode] = useState('');
  const [category, setCategory] = useState<'académico' | 'cultural' | 'deportivo' | 'festivo' | 'administrativo'>('cultural');
  const [requiresConfirmation, setRequiresConfirmation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    addEvent({
      title: title.trim(),
      description: description.trim(),
      date,
      time: time || '09:00 hrs',
      location: location.trim() || 'Campus Escolar',
      targetGroup,
      dressCode: dressCode.trim() || undefined,
      category,
      requiresConfirmation,
    });

    // Reset
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setLocation('');
    setDressCode('');
    setIsCreating(false);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'cultural':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'deportivo':
        return 'bg-emerald-50 text-[#049643] border-emerald-200';
      case 'académico':
        return 'bg-blue-50 text-[#0694E8] border-blue-200';
      case 'festivo':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Calendario & Gestión de Eventos Escolares
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Publicación de festivales, juntas de padres, torneos deportivos y fechas académicas
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0694E8] hover:bg-[#0582cd] rounded-lg shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Evento</span>
        </button>
      </div>

      {/* Create Event Modal */}
      {isCreating && (
        <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0694E8]" />
              Agendar Nuevo Evento Institucional
            </h3>
            <button
              onClick={() => setIsCreating(false)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre del Evento
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Festival de Primavera 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                >
                  <option value="cultural">Cultural / Artístico</option>
                  <option value="académico">Académico / Evaluaciones</option>
                  <option value="deportivo">Deportivo / Convivencia</option>
                  <option value="festivo">Festivo / Conmemorativo</option>
                  <option value="administrativo">Administrativo / Consejo Técnico</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fecha del Evento
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Horario
                </label>
                <input
                  type="text"
                  placeholder="Ej. 09:00 - 13:00 hrs"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grupo Destinatario
                </label>
                <select
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value as SchoolGroup)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                >
                  {SCHOOL_GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ubicación / Lugar
                </label>
                <input
                  type="text"
                  placeholder="Ej. Patio Central o Auditorio"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Código de Vestimenta / Requisitos
                </label>
                <input
                  type="text"
                  placeholder="Ej. Uniforme de gala o ropa tradicional"
                  value={dressCode}
                  onChange={(e) => setDressCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descripción Detallada
              </label>
              <textarea
                rows={3}
                placeholder="Indica las instrucciones y detalles del evento para los padres..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={requiresConfirmation}
                  onChange={(e) => setRequiresConfirmation(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0694E8] focus:ring-[#0694E8] border-slate-300"
                />
                <span className="text-slate-700 font-medium">
                  Solicitar confirmación de asistencia a los padres
                </span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0694E8] hover:bg-[#0582cd] rounded-lg shadow-xs transition"
                >
                  Publicar Evento
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-900">No hay eventos programados</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Utiliza el botón de "Nuevo Evento" para programar actividades escolares en el calendario institucional.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryBadge(
                      ev.category
                    )}`}
                  >
                    {ev.category}
                  </span>

                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    {ev.targetGroup}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">
                  {ev.title}
                </h3>
                <p className="text-xs text-slate-600 mb-4 line-clamp-2">{ev.description}</p>

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
                      <span>Vestimenta: {ev.dressCode}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                {ev.requiresConfirmation ? (
                  <span className="text-[11px] font-semibold text-[#049643]">
                    ✓ Requiere confirmación de asistencia
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Entrada libre a familias</span>
                )}

                <button
                  onClick={() => deleteEvent(ev.id)}
                  className="p-1.5 text-slate-400 hover:text-[#D32421] hover:bg-red-50 rounded-lg transition"
                  title="Eliminar evento"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
