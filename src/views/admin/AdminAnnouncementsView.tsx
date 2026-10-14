import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolGroup } from '../../types';
import {
  Bell,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Paperclip,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
} from 'lucide-react';

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

export const AdminAnnouncementsView: React.FC = () => {
  const { announcements, addAnnouncement, deleteAnnouncement, toggleAnnouncementReadOnly } = useSchool();
  const [selectedFilterGroup, setSelectedFilterGroup] = useState<string>('Todos');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetGroup, setTargetGroup] = useState<SchoolGroup>('Todos los grupos');
  const [priority, setPriority] = useState<'normal' | 'importante' | 'urgente'>('normal');
  const [readOnlyMode, setReadOnlyMode] = useState<boolean>(true); // Default: Solo lectura activado
  const [attachmentName, setAttachmentName] = useState<string>('');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addAnnouncement({
      title: title.trim(),
      content: content.trim(),
      group: targetGroup,
      author: 'Dirección Escolar / Administración',
      priority: priority,
      readOnly: readOnlyMode,
      hasAttachment: !!attachmentName.trim(),
      attachmentName: attachmentName.trim() || undefined,
    });

    // Reset Form
    setTitle('');
    setContent('');
    setAttachmentName('');
    setIsCreating(false);
  };

  const filteredAnnouncements = announcements.filter((ann) => {
    if (selectedFilterGroup === 'Todos') return true;
    return ann.group === selectedFilterGroup;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Muro de Avisos Institucionales
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Publicación segmentada por grupos y control de interacción institucional
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0694E8] hover:bg-[#0582cd] rounded-lg shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Aviso por Grupo</span>
        </button>
      </div>

      {/* Control de Interacción Explicativo Banner */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <div className="p-2 bg-[#0694E8]/10 rounded-lg text-[#0694E8] shrink-0">
          <Lock className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-700">
          <span className="font-bold text-slate-900 block text-sm">
            Control de Interacción en Canales Escolares
          </span>
          <p className="mt-0.5">
            El sistema permite configurar los avisos en <strong>modo Solo Lectura</strong> para garantizar que los canales institucionales permanezcan organizados y los padres de familia no puedan enviar respuestas o saturar el hilo de comunicación.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-medium">Filtrar por Grupo:</span>
          <select
            value={selectedFilterGroup}
            onChange={(e) => setSelectedFilterGroup(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#0694E8]"
          >
            <option value="Todos">Todos los grupos ({announcements.length})</option>
            {SCHOOL_GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-500 font-mono tabular-nums">
          {filteredAnnouncements.length} {filteredAnnouncements.length === 1 ? 'aviso registrado' : 'avisos registrados'}
        </span>
      </div>

      {/* Modal / Card to Create New Announcement */}
      {isCreating && (
        <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#0694E8]" />
              Crear Nuevo Comunicado Escolar
            </h3>
            <button
              onClick={() => setIsCreating(false)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handlePublish} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título del Aviso
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Junta Extraordinaria de Padres"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0694E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grupo Destinatario
                </label>
                <select
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value as SchoolGroup)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0694E8]"
                >
                  {SCHOOL_GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contenido del Comunicado
              </label>
              <textarea
                required
                rows={4}
                placeholder="Escribe el mensaje detallado para los padres de familia..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0694E8]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nivel de Prioridad
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0694E8]"
                >
                  <option value="normal">Normal (Informativo)</option>
                  <option value="importante">Importante</option>
                  <option value="urgente">Urgente (Atención requerida)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Archivo Adjunto (Opcional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ej. Circular_Octubre_2026.pdf"
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0694E8]"
                  />
                </div>
              </div>

              {/* Control de interacción en el formulario */}
              <div className="sm:pt-6">
                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={readOnlyMode}
                    onChange={(e) => setReadOnlyMode(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0694E8] focus:ring-[#0694E8] border-slate-300"
                  />
                  <span className="font-semibold text-slate-800">
                    Modo Solo Lectura (Sin respuestas de papás)
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0694E8] hover:bg-[#0582cd] rounded-lg transition shadow-xs"
              >
                Publicar en el Muro
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List of Announcements */}
      {filteredAnnouncements.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-900">No hay avisos publicados</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Actualmente no hay comunicados activos para el filtro seleccionado. Puedes crear el primer aviso escolar con el botón superior.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((ann) => {
            const isUrg = ann.priority === 'urgente';
            const isImp = ann.priority === 'importante';

            return (
              <div
                key={ann.id}
                className={`bg-white rounded-xl border p-5 transition-all shadow-xs ${
                  isUrg
                    ? 'border-red-300 bg-red-50/20'
                    : isImp
                    ? 'border-amber-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Meta row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-800 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                      {ann.group}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 flex items-center gap-1 font-mono tabular-nums">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {ann.date}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{ann.author}</span>
                  </div>

                  {/* Priority tag */}
                  <div className="flex items-center gap-2">
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
                  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
                    <Paperclip className="w-3.5 h-3.5 text-[#0694E8]" />
                    <span>{ann.attachmentName}</span>
                  </div>
                )}

                {/* Bottom action row: Control de Interacción & Delete */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  {/* Interactive toggle for Read Only */}
                  <button
                    onClick={() => toggleAnnouncementReadOnly(ann.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
                      ann.readOnly
                        ? 'bg-blue-50 text-[#0694E8] border-blue-200 hover:bg-blue-100'
                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    }`}
                    title="Haz clic para alternar el permiso de respuesta de los padres"
                  >
                    {ann.readOnly ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Solo Lectura Activado (Respuestas bloqueadas)</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Canal Abierto (Padres pueden responder)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="p-1.5 text-slate-400 hover:text-[#D32421] hover:bg-red-50 rounded-lg transition"
                    title="Eliminar aviso"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
