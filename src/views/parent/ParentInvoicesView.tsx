import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { FiscalData, InvoiceRecord } from '../../types';
import {
  FileText,
  Download,
  CheckCircle,
  FileCode,
  ShieldCheck,
  Save,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

const REGIMENES_FISCALES = [
  '605 - Sueldos y Salarios e Ingresos Asimilados a Salarios',
  '612 - Personas Físicas con Actividades Empresariales y Profesionales',
  '626 - Régimen Simplificado de Confianza (RESICO)',
  '601 - General de Ley Personas Morales',
  '616 - Sin obligaciones fiscales',
];

const USOS_CFDI = [
  'D10 - Pagos por servicios educativos (colegiaturas)',
  'G03 - Gastos en general',
  'S01 - Sin efectos fiscales',
  'CP01 - Pagos',
];

export const ParentInvoicesView: React.FC = () => {
  const { fiscalData, updateFiscalData, invoices, transactions, generateInvoice, showToast } = useSchool();

  // Form draft
  const [formData, setFormData] = useState<FiscalData>({ ...fiscalData });
  const [isEditingData, setIsEditingData] = useState(false);

  // Filter invoices for this student / parent RFC
  const parentInvoices = invoices.filter(
    (inv) => inv.rfcReceptor.toUpperCase() === fiscalData.rfc.toUpperCase() || inv.studentName.includes('Mateo')
  );

  // Payments that haven't been invoiced yet
  const unInvoicedTransactions = transactions.filter((t) => !t.hasInvoice);

  const handleSaveFiscal = (e: React.FormEvent) => {
    e.preventDefault();
    updateFiscalData(formData);
    setIsEditingData(false);
  };

  const handleDownloadXml = (inv: InvoiceRecord) => {
    const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" Version="4.0" Serie="F" Folio="${inv.folioInterno}" Fecha="${inv.fechaEmision}" Sello="SIMULATED_SAT_STAMP" FormaPago="03" SubTotal="${inv.subtotal}" Moneda="MXN" Total="${inv.total}" TipoDeComprobante="I" MetodoPago="PUE" LugarExpedicion="03100">
  <cfdi:Emisor Rfc="MSA200101ABC" Nombre="COLEGIO MY SCHOOL ABC SC" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="${inv.rfcReceptor}" Nombre="${inv.razonSocialReceptor}" DomicilioFiscalReceptor="03100" RegimenFiscalReceptor="605" UsoCFDI="${inv.usoCFDI.split(' ')[0]}"/>
  <cfdi:Complemento>
    <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" Version="1.1" UUID="${inv.uuid}" FechaTimbrado="${inv.fechaEmision}"/>
  </cfdi:Complemento>
</cfdi:Comprobante>`;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CFDI_${inv.folioInterno}_${inv.rfcReceptor}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Archivo XML del SAT descargado: ${inv.folioInterno}.xml`);
  };

  const handleDownloadPdf = (inv: InvoiceRecord) => {
    showToast(`Generando y descargando PDF timbrado de ${inv.folioInterno}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Módulo de Autofacturación CFDI 4.0
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ingreso de datos fiscales y descarga inmediata de comprobantes SAT para deducción
          </p>
        </div>
      </div>

      {/* Fiscal Data Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0694E8]" />
            <h2 className="font-bold text-slate-900 text-sm">
              Datos Fiscales del Contribuyente
            </h2>
          </div>
          <button
            onClick={() => setIsEditingData(!isEditingData)}
            className="text-xs font-semibold text-[#0694E8] hover:underline"
          >
            {isEditingData ? 'Cancelar Edición' : 'Editar Datos Fiscales'}
          </button>
        </div>

        {isEditingData ? (
          <form onSubmit={handleSaveFiscal} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  RFC del Contribuyente
                </label>
                <input
                  type="text"
                  required
                  value={formData.rfc}
                  onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                  placeholder="SAMP8506124K2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre o Razón Social (Como aparece en la CSF)
                </label>
                <input
                  type="text"
                  required
                  value={formData.razonSocial}
                  onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                  placeholder="PEDRO SÁNCHEZ MORALES"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Régimen Fiscal
                </label>
                <select
                  value={formData.regimenFiscal}
                  onChange={(e) => setFormData({ ...formData, regimenFiscal: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                >
                  {REGIMENES_FISCALES.map((reg) => (
                    <option key={reg} value={reg}>
                      {reg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Código Postal Fiscal
                </label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={formData.codigoPostal}
                  onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                  placeholder="03100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Uso del CFDI
                </label>
                <select
                  value={formData.usoCFDI}
                  onChange={(e) => setFormData({ ...formData, usoCFDI: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                >
                  {USOS_CFDI.map((uso) => (
                    <option key={uso} value={uso}>
                      {uso}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Correo Electrónico para Envío de Facturas
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                  placeholder="pedro.sanchez@ejemplo.com"
                />
              </div>
            </div>

            {/* Datos del Alumno para Deducción Escolar */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-[#049643] block mb-2">
                Datos del Alumno (Complemento de Servicios Educativos SAT)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    CURP del Alumno
                  </label>
                  <input
                    type="text"
                    value={formData.curpAlumno || ''}
                    onChange={(e) => setFormData({ ...formData, curpAlumno: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                    placeholder="SAMM180514HDFRN02"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Nivel Educativo
                  </label>
                  <input
                    type="text"
                    value={formData.nivelEducativo || 'Primaria'}
                    onChange={(e) => setFormData({ ...formData, nivelEducativo: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                    placeholder="Primaria"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingData(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0694E8] hover:bg-[#0582cd] rounded-lg transition shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Datos Fiscales</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">RFC</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{fiscalData.rfc}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Razón Social</span>
              <span className="font-semibold text-slate-800">{fiscalData.razonSocial}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Código Postal</span>
              <span className="font-mono text-slate-700">{fiscalData.codigoPostal}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Régimen Fiscal</span>
              <span className="text-slate-700 truncate block">{fiscalData.regimenFiscal}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Uso de CFDI</span>
              <span className="text-slate-700 truncate block">{fiscalData.usoCFDI}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">CURP Alumno (Deducción)</span>
              <span className="font-mono text-[#049643] font-semibold">{fiscalData.curpAlumno || 'SAMM180514HDFRN02'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Pagos Pendientes de Facturar */}
      {unInvoicedTransactions.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-700" />
            <h3 className="font-bold text-amber-950 text-xs uppercase tracking-wide">
              Tienes Pagos Recientes Disponibles para Autofacturar
            </h3>
          </div>
          <p className="text-xs text-amber-900">
            Puedes generar el CFDI 4.0 inmediatamente con un solo clic:
          </p>
          <div className="space-y-2">
            {unInvoicedTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white p-3 rounded-lg border border-amber-200 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{tx.conceptTitle}</span>
                  <span className="text-[11px] text-slate-500 font-mono">Folio: {tx.folio} · {tx.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold font-mono tabular-nums text-slate-900">
                    ${tx.amount.toLocaleString()} MXN
                  </span>
                  <button
                    onClick={() => generateInvoice(tx.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0694E8] hover:bg-[#0582cd] rounded-lg shadow-xs transition"
                  >
                    Generar Factura SAT
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Facturas Emitidas Descargables */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Tus Facturas Electrónicas Descargables (CFDI 4.0)
        </h2>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {parentInvoices.length === 0 ? (
            <div className="text-center py-10 p-6 space-y-2">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-900">No hay facturas timbradas aún</h3>
              <p className="text-xs text-slate-500">
                Al realizar tus pagos con la opción de autofactura activada, tus CFDIs aparecerán aquí listos para descargar en PDF y XML.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Folio Fiscal</th>
                    <th className="py-3 px-4">Fecha Timbrado</th>
                    <th className="py-3 px-4">Alumno</th>
                    <th className="py-3 px-4 text-right">Total</th>
                    <th className="py-3 px-4 text-center">Estado SAT</th>
                    <th className="py-3 px-4 text-right">Descargas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parentInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {inv.folioInterno}
                        <span className="text-[10px] text-slate-400 block truncate max-w-[170px]" title={inv.uuid}>
                          {inv.uuid}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                        {new Date(inv.fechaEmision).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-800">
                        {inv.studentName}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                        ${inv.total.toLocaleString()} MXN
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#049643] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          Vigente SAT
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDownloadPdf(inv)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#D32421] bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition"
                            title="Descargar Representación Impresa en PDF"
                          >
                            <Download className="w-3 h-3" />
                            PDF
                          </button>
                          <button
                            onClick={() => handleDownloadXml(inv)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#049643] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition"
                            title="Descargar Archivo XML Oficial del SAT"
                          >
                            <FileCode className="w-3 h-3" />
                            XML
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
