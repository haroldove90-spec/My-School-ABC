import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { PaymentConcept, PaymentMethodType, FiscalData } from '../../types';
import {
  CreditCard,
  Building,
  Store,
  CheckCircle2,
  Lock,
  Download,
  Copy,
  Printer,
  FileText,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react';

export const ParentPaymentsView: React.FC = () => {
  const {
    paymentConcepts,
    transactions,
    processPayment,
    fiscalData,
    updateFiscalData,
    generateInvoice,
    showToast,
  } = useSchool();

  const [selectedConcept, setSelectedConcept] = useState<PaymentConcept | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('card');
  const [generateInvoiceImmediate, setGenerateInvoiceImmediate] = useState<boolean>(true);

  // Card form state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('PEDRO SANCHEZ MORALES');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [isProcessing, setIsProcessing] = useState(false);

  // Success view modal state
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    folio: string;
    amount: number;
    method: PaymentMethodType;
    conceptTitle: string;
    clabe?: string;
    oxxoCode?: string;
    invoiceCreated?: boolean;
  } | null>(null);

  const pendingConcepts = paymentConcepts.filter((c) => c.status === 'pendiente');

  const handleStartPayment = (concept: PaymentConcept) => {
    setSelectedConcept(concept);
  };

  const handleExecutePayment = () => {
    if (!selectedConcept) return;

    setIsProcessing(true);

    setTimeout(() => {
      const res = processPayment(selectedConcept.id, selectedMethod, {
        cardLast4: '4242',
        cardBrand: 'Visa Débito',
        generateInvoiceImmediate: generateInvoiceImmediate,
      });

      setIsProcessing(false);

      // Open Success Confirmation
      setPaymentSuccessData({
        folio: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: selectedConcept.amount,
        method: selectedMethod,
        conceptTitle: selectedConcept.title,
        clabe: '646180123456789012',
        oxxoCode: '9823-4512-8923-01',
        invoiceCreated: generateInvoiceImmediate,
      });

      setSelectedConcept(null);
    }, 800);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copiado al portapapeles.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Pasarela de Pagos Escolares en Línea
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pago seguro de colegiaturas, talleres y comedor con autofacturación CFDI 4.0 inmediata
          </p>
        </div>
      </div>

      {/* Security guarantee */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#049643]/10 text-[#049643] rounded-lg shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="text-xs text-slate-700">
            <span className="font-bold text-slate-900 block text-xs">
              Transacciones Cifradas de Grado Bancario (PCI-DSS)
            </span>
            <p className="text-slate-600 mt-0.5">
              Todos los cobros por tarjeta, transferencias SPEI y OXXO Pay se concilian de inmediato en el sistema escolar.
            </p>
          </div>
        </div>
      </div>

      {/* Pending Concepts Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Cuotas y Colegiaturas Pendientes
        </h2>

        {pendingConcepts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#049643] mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">¡Estás al corriente con tus pagos!</h3>
            <p className="text-xs text-slate-500">
              No tienes colegiaturas ni cuotas pendientes por liquidar en este momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pendingConcepts.map((concept) => (
              <div
                key={concept.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-[#D32421] border border-red-200">
                      Pendiente
                    </span>
                    <span className="text-xs font-mono tabular-nums text-slate-500">
                      Vence: {concept.dueDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {concept.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">{concept.studentName} · {concept.studentGroup}</p>

                  <div className="py-2 border-t border-slate-100 flex items-baseline justify-between">
                    <span className="text-xs text-slate-500">Total a pagar:</span>
                    <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                      ${concept.amount.toLocaleString()} <span className="text-xs font-normal text-slate-400">MXN</span>
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-2">
                  <button
                    onClick={() => handleStartPayment(concept)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#0694E8] hover:bg-[#0582cd] text-white text-xs font-semibold shadow-xs transition"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pagar Ahora</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historial de Pagos y Comprobantes */}
      <div className="space-y-3 pt-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Historial de Pagos Realizados por tu Familia
        </h2>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Folio / Fecha</th>
                  <th className="py-3 px-4">Concepto</th>
                  <th className="py-3 px-4">Método</th>
                  <th className="py-3 px-4 text-right">Monto Pagado</th>
                  <th className="py-3 px-4 text-center">Factura SAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-slate-900 block">{tx.folio}</span>
                      <span className="text-[10px] text-slate-400">{tx.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">{tx.conceptTitle}</span>
                      <span className="text-[11px] text-slate-500">{tx.studentName}</span>
                    </td>
                    <td className="py-3 px-4">
                      {tx.method === 'card' && <span className="text-blue-700 font-medium">Tarjeta</span>}
                      {tx.method === 'transfer' && <span className="text-emerald-700 font-medium">SPEI</span>}
                      {tx.method === 'oxxo' && <span className="text-red-700 font-medium">OXXO</span>}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                      ${tx.amount.toLocaleString()} MXN
                    </td>
                    <td className="py-3 px-4 text-center">
                      {tx.hasInvoice ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#049643] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          CFDI Timbrado
                        </span>
                      ) : (
                        <button
                          onClick={() => generateInvoice(tx.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#0694E8] hover:bg-[#0582cd] rounded-md transition shadow-xs"
                        >
                          Autofacturar Ahora
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {selectedConcept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Pasarela de Pago Segura</h3>
                <p className="text-xs text-slate-500">Liquidación en línea de cuotas escolares</p>
              </div>
              <button
                onClick={() => setSelectedConcept(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Concept Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Concepto a liquidar
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedConcept.title}</h4>
                  <p className="text-xs text-slate-500">{selectedConcept.studentName}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Monto
                  </span>
                  <span className="text-lg font-bold font-mono tabular-nums text-[#0694E8]">
                    ${selectedConcept.amount.toLocaleString()} <span className="text-xs font-normal">MXN</span>
                  </span>
                </div>
              </div>

              {/* Selector de Método de Pago: Tarjeta, Transferencia, Oxxo */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Selecciona tu Método de Pago:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                      selectedMethod === 'card'
                        ? 'border-[#0694E8] bg-blue-50/50 text-[#0694E8] font-bold ring-1 ring-[#0694E8]'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs">Tarjeta Bancaria</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('transfer')}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                      selectedMethod === 'transfer'
                        ? 'border-[#049643] bg-emerald-50/50 text-[#049643] font-bold ring-1 ring-[#049643]'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Building className="w-5 h-5" />
                    <span className="text-xs">SPEI / CLABE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('oxxo')}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                      selectedMethod === 'oxxo'
                        ? 'border-[#D32421] bg-red-50/50 text-[#D32421] font-bold ring-1 ring-[#D32421]'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Store className="w-5 h-5" />
                    <span className="text-xs">OXXO Pay</span>
                  </button>
                </div>
              </div>

              {/* Dynamic details for chosen method */}
              {selectedMethod === 'card' && (
                <div className="p-4 rounded-xl border border-slate-200 space-y-3 bg-white">
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
                    <span className="font-bold text-slate-800">Datos de la Tarjeta (Débito o Crédito)</span>
                    <span className="text-slate-400">Visa · Mastercard · Amex</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Número de Tarjeta
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nombre del Titular
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Expiración (MM/AA)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Código CVV (3 dígitos)
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0694E8]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'transfer' && (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#049643]">
                    <Building className="w-4 h-4" />
                    <span>Datos de Transferencia Bancaria Interbancaria (SPEI)</span>
                  </div>

                  <div className="space-y-2 text-xs bg-white p-3 rounded-lg border border-emerald-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Banco Receptor:</span>
                      <span className="font-semibold text-slate-900">STP / BBVA México</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Beneficiario:</span>
                      <span className="font-semibold text-slate-900">COLEGIO MY SCHOOL ABC SC</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-slate-500">CLABE Interbancaria:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-900 text-xs">
                          646180123456789012
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('646180123456789012', 'CLABE')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500"
                          title="Copiar CLABE"
                        >
                          <Copy className="w-3.5 h-3.5 text-[#0694E8]" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Concepto de Pago:</span>
                      <span className="font-mono text-slate-800">COL-{selectedConcept.id.slice(5)}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    La conciliación del pago se efectúa automáticamente en menos de 5 minutos al recibir la notificación bancaria.
                  </p>
                </div>
              )}

              {selectedMethod === 'oxxo' && (
                <div className="p-4 rounded-xl border border-red-200 bg-red-50/40 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#D32421]">
                    <Store className="w-4 h-4" />
                    <span>Ficha de Pago en Efectivo OXXO Pay</span>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-red-100 text-center space-y-3">
                    <span className="text-[11px] text-slate-500 block">
                      Entrega esta referencia al cajero de cualquier tienda OXXO:
                    </span>
                    <div className="p-2 bg-slate-50 rounded-lg inline-block font-mono text-base font-bold text-slate-900 tracking-wider">
                      9823-4512-8923-01
                    </div>

                    {/* Barcode Graphic */}
                    <div className="py-2 px-4 bg-white border border-dashed border-slate-300 rounded-md flex flex-col items-center justify-center">
                      <div className="h-10 flex items-center justify-center gap-1">
                        {[4, 2, 6, 2, 5, 1, 3, 4, 2, 7, 3, 2, 5, 2, 4, 6, 2, 3, 5, 2, 4].map(
                          (w, idx) => (
                            <span
                              key={idx}
                              className="bg-slate-900 inline-block h-full"
                              style={{ width: `${w * 1.5}px` }}
                            />
                          )
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-600 mt-1">98234512892301</span>
                    </div>

                    <p className="text-[10px] text-slate-400">
                      OXXO cobrará una comisión fija de $15.00 MXN en caja por recepción de pago.
                    </p>
                  </div>
                </div>
              )}

              {/* Módulo de Autofacturación Integrado */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <label className="flex items-start gap-2 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={generateInvoiceImmediate}
                    onChange={(e) => setGenerateInvoiceImmediate(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#0694E8] focus:ring-[#0694E8] border-slate-300"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Generar y timbrar factura fiscal (CFDI 4.0) inmediatamente al pagar
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Recibirás la factura deducible al instante con los datos fiscales guardados.
                    </span>
                  </div>
                </label>

                {generateInvoiceImmediate && (
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">RFC Receptor:</span>
                      <span className="font-mono font-bold text-slate-800">{fiscalData.rfc}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Razón Social:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                        {fiscalData.razonSocial}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Uso de CFDI:</span>
                      <span className="text-slate-700 truncate max-w-[180px]">
                        {fiscalData.usoCFDI}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedConcept(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200/60 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecutePayment}
                disabled={isProcessing}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#0694E8] hover:bg-[#0582cd] rounded-lg transition shadow-xs disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Procesando pago...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Confirmar y Liquidar ${selectedConcept.amount.toLocaleString()} MXN</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Success Modal with Invoice & Receipt */}
      {paymentSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-center p-6 space-y-4">
            <CheckCircle2 className="w-14 h-14 text-[#049643] mx-auto animate-in zoom-in duration-200" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">¡Pago Registrado Exitosamente!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Folio institucional de transacción: <strong className="font-mono text-slate-700">{paymentSuccessData.folio}</strong>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Concepto:</span>
                <span className="font-semibold text-slate-900">{paymentSuccessData.conceptTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Monto:</span>
                <span className="font-mono font-bold text-slate-900">
                  ${paymentSuccessData.amount.toLocaleString()} MXN
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Método utilizado:</span>
                <span className="font-semibold capitalize text-slate-800">
                  {paymentSuccessData.method === 'card' ? 'Tarjeta Bancaria' : paymentSuccessData.method === 'transfer' ? 'SPEI Transferencia' : 'OXXO Pay'}
                </span>
              </div>
              {paymentSuccessData.invoiceCreated && (
                <div className="flex justify-between text-[#049643] font-bold border-t border-slate-200 pt-2">
                  <span>Factura CFDI 4.0:</span>
                  <span>TIMBRADA ANTE EL SAT</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setPaymentSuccessData(null)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#0694E8] hover:bg-[#0582cd] rounded-xl transition shadow-xs"
              >
                Aceptar y Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
