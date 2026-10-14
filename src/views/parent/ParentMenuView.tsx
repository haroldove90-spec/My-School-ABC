import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Utensils, AlertTriangle, Apple, Coffee, Calendar } from 'lucide-react';

export const ParentMenuView: React.FC = () => {
  const { menuItems } = useSchool();
  const [selectedDay, setSelectedDay] = useState<string>('Lunes');

  const activeDayItem = menuItems.find((m) => m.dayOfWeek === selectedDay) || menuItems[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Consulta del Menú del Comedor Escolar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Nutrición balanceada supervisada por el departamento de salud escolar
          </p>
        </div>
      </div>

      {/* Day Selector Buttons */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-xs">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedDay(item.dayOfWeek)}
            className={`flex-1 min-w-[70px] py-2 px-3 rounded-lg text-xs font-semibold transition text-center ${
              selectedDay === item.dayOfWeek
                ? 'bg-[#0694E8] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div>{item.dayOfWeek}</div>
            <div className="text-[10px] opacity-80 font-normal font-mono">{item.date.slice(5)}</div>
          </button>
        ))}
      </div>

      {/* Selected Day Showcase Card */}
      {activeDayItem ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Day top ribbon */}
          <div className="bg-slate-900 text-white p-5 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold block">
                Menú Seleccionado
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {activeDayItem.dayOfWeek} · {activeDayItem.date}
              </h2>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-xs font-mono tabular-nums">
              Aporte Calórico: <strong className="text-[#0694E8]">{activeDayItem.calories} kcal</strong>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Primary Dish Spotlight */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0694E8] uppercase tracking-wider block">
                Platillo Principal
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {activeDayItem.mainDish}
              </h3>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Entrada / Sopa
                </span>
                <p className="font-semibold text-slate-900 text-xs">{activeDayItem.soup}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Guarnición
                </span>
                <p className="font-semibold text-slate-900 text-xs">{activeDayItem.sideDish}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Postre Saludable
                </span>
                <p className="font-semibold text-slate-900 text-xs">{activeDayItem.dessert}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Bebida Natural
                </span>
                <p className="font-semibold text-slate-900 text-xs">{activeDayItem.drink}</p>
              </div>
            </div>

            {/* Allergens warning */}
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-900">
                  Advertencias de Alérgenos:
                </span>
              </div>

              {activeDayItem.allergens.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {activeDayItem.allergens.map((alg) => (
                    <span
                      key={alg}
                      className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold"
                    >
                      Contiene {alg}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  No se identifican alérgenos comunes registrados en este menú.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6 space-y-2">
          <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-900">No hay menús registrados</h3>
          <p className="text-xs text-slate-500">
            La escuela aún no ha publicado el menú semanal del comedor.
          </p>
        </div>
      )}
    </div>
  );
};
