import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X, Share, PlusSquare, CheckCircle, Smartphone, Monitor } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <img
              src="https://appdesignproyectos.com/myschoolicono.png"
              alt="My School ABC"
              className="w-8 h-8 rounded-lg object-contain bg-slate-50 border border-slate-100 p-0.5"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Instalar My School ABC</h3>
              <p className="text-xs text-slate-500">App web progresiva (PWA)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isInstalled ? (
            <div className="text-center py-4 space-y-3">
              <CheckCircle className="w-12 h-12 text-[#049643] mx-auto" />
              <h4 className="font-semibold text-slate-900 text-base">¡App ya instalada!</h4>
              <p className="text-xs text-slate-600">
                My School ABC ya se encuentra instalada en tu dispositivo y lista para usarse en modo pantalla completa.
              </p>
            </div>
          ) : isIOS ? (
            /* iOS Safari Step-by-step instructions */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0694E8] uppercase tracking-wide">
                <Smartphone className="w-4 h-4" />
                <span>Instrucciones para iPhone / iPad</span>
              </div>
              
              <p className="text-xs text-slate-600 leading-relaxed">
                En Safari para iOS, puedes instalar My School ABC en tu pantalla de inicio siguiendo estos 2 sencillos pasos:
              </p>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0694E8] text-white text-[10px] font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900">Toca el botón Compartir</span>
                    <p className="text-slate-500 mt-0.5">
                      Ubicado en la barra inferior de Safari (ícono con un cuadro y flecha hacia arriba <Share className="inline w-3 h-3 text-[#0694E8]" />).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0694E8] text-white text-[10px] font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900">Selecciona "Agregar a pantalla de inicio"</span>
                    <p className="text-slate-500 mt-0.5">
                      Desliza hacia abajo en el menú y pulsa <PlusSquare className="inline w-3 h-3 text-slate-700" /> "Agregar a pantalla de inicio" y luego "Agregar".
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : isInstallable ? (
            /* Native prompt available (Android / Chrome / Edge) */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#049643] uppercase tracking-wide">
                <Smartphone className="w-4 h-4" />
                <span>Instalación Directa Disponible</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instala My School ABC directamente en tu teléfono, tablet o computadora para acceder rápidamente desde tu escritorio sin barra de navegación del navegador.
              </p>
              <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#0694E8] shrink-0" />
                <span className="text-xs text-slate-700">
                  Acceso offline a avisos y menús guardados, notificaciones y experiencia fluida.
                </span>
              </div>
            </div>
          ) : (
            /* Desktop / Manual browser instructions */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wide">
                <Monitor className="w-4 h-4" />
                <span>Instalación en Navegador</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Para instalar en Chrome, Edge o navegadores de escritorio:
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <p>
                  1. Haz clic en el ícono de instalación <strong>(⊕ Instalar aplicación)</strong> situado en la barra de direcciones superior del navegador.
                </p>
                <p>
                  2. O abre el menú del navegador <strong>(⋮) → "Instalar My School ABC"</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
          >
            Cerrar
          </button>
          {isInstallable && !isInstalled && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0694E8] hover:bg-[#0582cd] rounded-lg shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar Ahora</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
