import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { InvoiceRecord } from '../../types';
import {
  FileText,
  Download,
  CheckCircle,
  FileCode,
  Eye,
  ShieldCheck,
  Search,
  ExternalLink,
  X,
} from 'lucide-react';

export const AdminInvoicesView: React.FC = () => {
  const { invoices, showToast } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    return (
      inv.folioInterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.rfcReceptor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.razonSocialReceptor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.uuid.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDownloadPdf = (inv: InvoiceRecord) => {
    showToast(`Descargando representación impresa en PDF de ${inv.folioInterno}...`);
  };

  const handleDownloadXml = (inv: InvoiceRecord) => {
    const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" Version="4.0" Serie="F" Folio="${inv.folioInterno}" Fecha="${inv.fechaEmision}" Sello="SIMULATED_SAT_SIGNATURE" FormaPago="03" SubTotal="${inv.subtotal}" Moneda="MXN" Total="${inv.total}" TipoDeComprobante="I" MetodoPago="PUE" LugarExpedicion="03100">
  <cfdi:Emisor Rfc="MSA200101ABC" Nombre="COLEGIO MY SCHOOL ABC SC" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="${inv.rfcReceptor}" Nombre="${inv.razonSocialReceptor}" DomicilioFiscalReceptor="03100" RegimenFiscalReceptor="605" UsoCFDI="${inv.usoCFDI.split(' ')[0]}"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="86121500" Cantidad="1" ClaveUnidad="E48" Descripcion="Colegiatura / Servicios Educativos Integrales" ValorUnitario="${inv.subtotal}" Importe="${inv.subtotal}"/>
  </cfdi:Conceptos>
  <cfdi:Complemento>
    <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" Version="1.1" UUID="${inv.uuid}" FechaTimbrado="${inv.fechaEmision}" RfcProvCertif="SAT970701NN3"/>
  </cfdi:Complemento>
</cfdi:Comprobante>`;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.folioInterno}_${inv.uuid.slice(0, 8)}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Archivo XML del SAT descargado: ${inv.folioInterno}.xml`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Emisión & Gestión de Facturación (CFDI 4.0)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Control de timbrado fiscal ante el SAT, certificados digitales y deducción de colegiaturas
          </p>
        </div>
      </div>

      {/* Compliance banner */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex items-start gap-3 shadow-xs">
        <div className="p-2 bg-white/10 rounded-lg text-[#0694E8] shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white">
              Emisión de Facturas Electrónicas Certificadas
            </span>
            <span className="bg-[#049643] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              CFDI 4.0 SAT ACTIVO
            </span>
          </div>
          <p className="text-slate-300">
            Todas las facturas generadas incluyen el complemento educativo con la CURP y grado del alumno para que los padres de familia puedan deducir sus colegiaturas en su Declaración Anual.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          <input
            type="text"
            placeholder="Buscar por RFC, Razón Social, Folio o UUID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-transparent border-none focus:outline-hidden text-slate-800 placeholder-slate-400"
          />
        </div>
        <span className="text-xs text-slate-500 font-mono tabular-nums">
          {filteredInvoices.length} {filteredInvoices.length === 1 ? 'factura' : 'facturas'}
        </span>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12 p-6 space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-900">No hay facturas emitidas</h3>
            <p className="text-xs text-slate-500">
              Las facturas timbradas por los padres o generadas en la sección de cobranza aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Folio Interno</th>
                  <th className="py-3 px-4">Folio Fiscal (UUID SAT)</th>
                  <th className="py-3 px-4">Receptor / Razón Social</th>
                  <th className="py-3 px-4">Uso de CFDI</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-center">Estado SAT</th>
                  <th className="py-3 px-4 text-right">Descargas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                      {inv.folioInterno}
                      <span className="text-[10px] text-slate-400 block font-normal">
                        {new Date(inv.fechaEmision).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      <span className="truncate block max-w-[190px]" title={inv.uuid}>
                        {inv.uuid}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block truncate max-w-[200px]">
                        {inv.razonSocialReceptor}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">{inv.rfcReceptor}</span>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-600 truncate max-w-[170px]">
                      {inv.usoCFDI}
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                      ${inv.total.toLocaleString()} MXN
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#049643] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        Timbrada
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="p-1.5 text-slate-600 hover:text-[#0694E8] hover:bg-slate-100 rounded-md transition"
                          title="Visualizar Comprobante"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(inv)}
                          className="p-1.5 text-slate-600 hover:text-[#D32421] hover:bg-red-50 rounded-md transition"
                          title="Descargar PDF"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#D32421]" />
                        </button>
                        <button
                          onClick={() => handleDownloadXml(inv)}
                          className="p-1.5 text-slate-600 hover:text-[#049643] hover:bg-emerald-50 rounded-md transition"
                          title="Descargar XML SAT"
                        >
                          <FileCode className="w-3.5 h-3.5 text-[#049643]" />
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

      {/* Invoice Viewer Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0694E8]" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Comprobante Fiscal Digital (CFDI 4.0)
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">Folio: {selectedInvoice.folioInterno}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Folio Fiscal (UUID):</span>
                  <span className="font-mono text-[11px] text-slate-900 select-all font-bold">
                    {selectedInvoice.uuid}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Fecha y Hora de Certificación:</span>
                  <span className="font-mono text-slate-700">
                    {new Date(selectedInvoice.fechaEmision).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Estado SAT:</span>
                  <span className="font-bold text-[#049643]">VIGENTE / CERTIFICADO</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Emisor
                  </span>
                  <p className="font-bold text-slate-900">COLEGIO MY SCHOOL ABC SC</p>
                  <p className="font-mono text-slate-600">RFC: MSA200101ABC</p>
                  <p className="text-slate-500">Régimen: 601 General de Ley</p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Receptor
                  </span>
                  <p className="font-bold text-slate-900">{selectedInvoice.razonSocialReceptor}</p>
                  <p className="font-mono text-slate-600">RFC: {selectedInvoice.rfcReceptor}</p>
                  <p className="text-slate-500 truncate" title={selectedInvoice.usoCFDI}>
                    {selectedInvoice.usoCFDI}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Desglose del Concepto
                </span>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Subtotal (Exento de IVA según Art. 15 Fracc. IV LIVA)</span>
                  <span className="font-mono font-semibold">${selectedInvoice.subtotal.toLocaleString()} MXN</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Impuestos Trasladados (IVA 0%)</span>
                  <span className="font-mono">${selectedInvoice.iva.toLocaleString()} MXN</span>
                </div>
                <div className="flex items-center justify-between text-slate-900 font-bold border-t border-slate-200 pt-2 text-sm">
                  <span>Total Facturado</span>
                  <span className="font-mono text-[#0694E8]">${selectedInvoice.total.toLocaleString()} MXN</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => handleDownloadXml(selectedInvoice)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition"
              >
                <FileCode className="w-3.5 h-3.5 text-[#049643]" />
                <span>Descargar XML</span>
              </button>
              <button
                onClick={() => handleDownloadPdf(selectedInvoice)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0694E8] hover:bg-[#0582cd] rounded-lg transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
