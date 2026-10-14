import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { MenuItem } from '../../types';
import { Utensils, Edit3, Check, X, ShieldAlert, Sparkles, Plus, Calendar } from 'lucide-react';

const COMMON_ALLERGENS = ['Lácteos', 'Gluten', 'Huevo', 'Pescado', 'Nueces', 'Soya'];

export const AdminMenuView: React.FC = () => {
  const { menuItems, updateMenuItem } = useSchool();
  const [editingDayId, setEditingDayId] = useState<string | null>(null);

  // Edit draft state
  const [draft, setDraft] = useState<MenuItem | null>(null);

  const startEditing = (item: MenuItem) => {
    setDraft({ ...item });
    setEditingDayId(item.id);
  };

  const handleSave = () => {
    if (!draft) return;
    updateMenuItem(draft);
    setEditingDayId(null);
    setDraft(null);
  };

  const handleAllergenToggle = (allergen: string) => {
    if (!draft) return;
    const exists = draft.allergens.includes(allergen);
    const updated = exists
      ? draft.allergens.filter((a) => a !== allergen)
      : [...draft.allergens, allergen];
    setDraft({ ...draft, allergens: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Gestión y Publicación del Menú del Comedor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Carga y actualización de la dieta balanceada semanal y control de alérgenos escolares
          </p>
        </div>
      </div>

      {/* Overview Card */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <div className="p-2 bg-[#049643]/10 rounded-lg text-[#049643] shrink-0">
          <Utensils className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-700">
          <span className="font-bold text-slate-900 block text-sm">
            Menú Semanal Nutricional
          </span>
          <p className="mt-0.5">
            Los menús publicados aquí se reflejan instantáneamente en el portal de los Padres de Familia para su supervisión alimentaria diaria.
          </p>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {menuItems.map((item) => {
          const isEditing = editingDayId === item.id;
          const currentData = isEditing && draft ? draft : item;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl border transition-all shadow-xs flex flex-col justify-between ${
                isEditing ? 'border-[#0694E8] ring-1 ring-[#0694E8]' : 'border-slate-200'
              }`}
            >
              {/* Day Header */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{currentData.dayOfWeek}</span>
                  <span className="text-xs text-slate-400 font-mono tabular-nums">({currentData.date})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono tabular-nums text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                    {currentData.calories} kcal
                  </span>
                  {!isEditing && (
                    <button
                      onClick={() => startEditing(item)}
                      className="p-1.5 text-slate-500 hover:text-[#0694E8] hover:bg-white rounded-md transition"
                      title="Editar menú del día"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Day Details */}
              <div className="p-4 space-y-3 flex-1 text-xs">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Platillo Principal
                      </label>
                      <input
                        type="text"
                        value={draft?.mainDish || ''}
                        onChange={(e) => setDraft(draft ? { ...draft, mainDish: e.target.value } : null)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-[#0694E8]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Guarnición
                      </label>
                      <input
                        type="text"
                        value={draft?.sideDish || ''}
                        onChange={(e) => setDraft(draft ? { ...draft, sideDish: e.target.value } : null)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-[#0694E8]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Sopa o Entrada
                      </label>
                      <input
                        type="text"
                        value={draft?.soup || ''}
                        onChange={(e) => setDraft(draft ? { ...draft, soup: e.target.value } : null)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-[#0694E8]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Postre
                        </label>
                        <input
                          type="text"
                          value={draft?.dessert || ''}
                          onChange={(e) => setDraft(draft ? { ...draft, dessert: e.target.value } : null)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-[#0694E8]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Bebida
                        </label>
                        <input
                          type="text"
                          value={draft?.drink || ''}
                          onChange={(e) => setDraft(draft ? { ...draft, drink: e.target.value } : null)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-[#0694E8]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Alérgenos presentes
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {COMMON_ALLERGENS.map((alg) => {
                          const active = draft?.allergens.includes(alg);
                          return (
                            <button
                              key={alg}
                              type="button"
                              onClick={() => handleAllergenToggle(alg)}
                              className={`px-2 py-0.5 text-[10px] rounded-md font-semibold transition ${
                                active
                                  ? 'bg-[#D32421] text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {alg}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Plato Fuerte
                      </span>
                      <p className="font-semibold text-slate-900 text-sm">{item.mainDish}</p>
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Acompañamientos
                      </span>
                      <p className="text-slate-600">{item.sideDish}</p>
                      <p className="text-slate-600">Sopa: {item.soup}</p>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-slate-600 border-t border-slate-100">
                      <span>Postre: {item.dessert}</span>
                      <span>Bebida: {item.drink}</span>
                    </div>

                    {/* Allergens warning */}
                    {item.allergens.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] text-amber-800 font-bold block mb-1">
                          Alérgenos declarados:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {item.allergens.map((alg) => (
                            <span
                              key={alg}
                              className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-semibold"
                            >
                              {alg}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Editing Controls */}
              {isEditing && (
                <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingDayId(null);
                      setDraft(null);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200/60 rounded-md transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0694E8] hover:bg-[#0582cd] rounded-md transition shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
