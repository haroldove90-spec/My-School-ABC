import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Trash2, RotateCcw, AlertTriangle, CheckCircle, Database, Code, X } from 'lucide-react';

interface DataResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataResetModal: React.FC<DataResetModalProps> = ({ isOpen, onClose }) => {
  const { isSampleDisabled, clearAllSampleData, restoreSampleData } = useSchool();
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(true);
  const [showSqlSchema, setShowSqlSchema] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleClear = () => {
    clearAllSampleData(dontShowAgain);
    onClose();
  };

  const handleRestore = () => {
    restoreSampleData();
    onClose();
  };

  const supabaseSqlSchema = `-- My School ABC - Esquema listo para Supabase PostgreSQL

-- 1. Tabla de Avisos del Muro
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    school_group TEXT NOT NULL,
    author TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    priority TEXT CHECK (priority IN ('normal', 'importante', 'urgente')),
    read_only BOOLEAN DEFAULT TRUE,
    has_attachment BOOLEAN DEFAULT FALSE,
    attachment_name TEXT
);

-- 2. Tabla de Menú Escolar
CREATE TABLE IF NOT EXISTS public.menu_weekly (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week TEXT NOT NULL,
    menu_date DATE NOT NULL,
    main_dish TEXT NOT NULL,
    side_dish TEXT,
    soup TEXT,
    dessert TEXT,
    drink TEXT,
    calories INTEGER,
    allergens TEXT[] DEFAULT '{}'
);

-- 3. Tabla de Eventos Escolares
CREATE TABLE IF NOT EXISTS public.school_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TEXT,
    location TEXT,
    target_group TEXT NOT NULL,
    dress_code TEXT,
    category TEXT CHECK (category IN ('académico', 'cultural', 'deportivo', 'festivo', 'administrativo'))
);

-- 4. Tabla de Cobranza y Transacciones
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folio TEXT UNIQUE NOT NULL,
    concept_title TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_group TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    method TEXT CHECK (method IN ('card', 'transfer', 'oxxo')),
    status TEXT CHECK (status IN ('completado', 'pendiente', 'en_validacion')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    clabe_ref TEXT,
    oxxo_barcode TEXT,
    card_last4 TEXT
);

-- 5. Tabla de Facturación CFDI
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uuid_sat TEXT UNIQUE NOT NULL,
    folio_interno TEXT NOT NULL,
    payment_id UUID REFERENCES public.payments(id),
    rfc_receptor TEXT NOT NULL,
    razon_social TEXT NOT NULL,
    uso_cfdi TEXT NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    iva NUMERIC(10,2) NOT NULL,
    status_sat TEXT DEFAULT 'timbrada',
    created_at TIMESTAMPTZ DEFAULT NOW()
);`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-50 text-[#D32421]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Gestión de Datos & Supabase</h3>
              <p className="text-xs text-slate-500">Limpieza del sistema y preparación de base de datos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Status Box */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Estado actual de la base de datos:</span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isSampleDisabled
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-[#049643]'
                }`}
              >
                {isSampleDisabled ? 'Base Limpia (Sin Datos Demo)' : 'Con Datos de Muestra'}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              {isSampleDisabled
                ? 'El sistema está operando en blanco, listo para recibir información real o conectarse a las tablas de Supabase.'
                : 'El sistema contiene comunicados, menús, eventos, pagos y facturas de demostración precargados para explorar las funciones de los roles.'}
            </p>
          </div>

          {/* Delete action card */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Acción de Limpieza del Sistema
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Al borrar los datos de muestra, se limpiarán los avisos del muro, el menú del comedor, el calendario, las órdenes de cobranza y los timbrados fiscales.
            </p>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#0694E8] focus:ring-[#0694E8] border-slate-300"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-900">
                  No volver a mostrar datos de muestra en este navegador
                </span>
                <p className="text-slate-500 mt-0.5">
                  Guarda la configuración permanente en el navegador para que al recargar o volver a ingresar no se vuelvan a inyectar datos ficticios y se mantenga limpio para Supabase.
                </p>
              </div>
            </label>
          </div>

          {/* Supabase Schema accordion */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSqlSchema(!showSqlSchema)}
              className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 text-left text-xs font-semibold text-slate-800 transition"
            >
              <span className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#0694E8]" />
                Ver Tablas SQL compatibles con Supabase
              </span>
              <span className="text-[11px] text-slate-500">
                {showSqlSchema ? 'Ocultar' : 'Mostrar'}
              </span>
            </button>
            {showSqlSchema && (
              <div className="p-3 bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto max-h-48 border-t border-slate-800">
                <pre>{supabaseSqlSchema}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={handleRestore}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
            title="Restaurar datos iniciales para demostraciones"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Restaurar Muestra</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200/60 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#D32421] hover:bg-[#b81d1a] rounded-lg shadow-xs transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Borrar Datos de Muestra</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
