import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { PaymentMethodType, PaymentStatusType, SchoolGroup } from '../../types';
import {
  CreditCard,
  Building,
  Store,
  CheckCircle2,
  Clock,
  Filter,
  DollarSign,
  Search,
  Plus,
  X,
  FileCheck,
} from 'lucide-react';

export const AdminPaymentsView: React.FC = () => {
  const { transactions, validateTransaction, generateInvoice } = useSchool();
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Financial summary calculations
  const totalCollected = transactions
    .filter((t) => t.status === 'completado')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const cardCollected = transactions
    .filter((t) => t.status === 'completado' && t.method === 'card')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const transferCollected = transactions
    .filter((t) => t.status === 'completado' && t.method === 'transfer')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const oxxoCollected = transactions
    .filter((t) => t.status === 'completado' && t.method === 'oxxo')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesMethod = selectedMethod === 'all' || tx.method === selectedMethod;
    const matchesSearch =
      tx.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.conceptTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.folio.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMethod && matchesSearch;
  });

  const getMethodBadge = (method: PaymentMethodType) => {
    switch (method) {
      case 'card':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0694E8] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
            <CreditCard className="w-3 h-3" />
            Tarjeta
          </span>
        );
      case 'transfer':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#049643] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <Building className="w-3 h-3" />
            SPEI Transferencia
          </span>
        );
      case 'oxxo':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D32421] bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
            <Store className="w-3 h-3" />
            OXXO Pay
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Gestión & Control de Cobranza
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Registro, validación y conciliación de colegiaturas e ingresos escolares
          </p>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Recaudado
          </span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            ${totalCollected.toLocaleString()} <span className="text-xs font-normal text-slate-400">MXN</span>
          </p>
          <span className="text-[11px] text-[#049643] font-medium mt-1 block">
            Conciliado en banco
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-[#0694E8] uppercase tracking-wider block flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5" />
            Vía Tarjeta
          </span>
          <p className="text-lg sm:text-xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            ${cardCollected.toLocaleString()} <span className="text-xs font-normal text-slate-400">MXN</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Débito / Crédito 3DS</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-[#049643] uppercase tracking-wider block flex items-center gap-1">
            <Building className="w-3.5 h-3.5" />
            Transferencia SPEI
          </span>
          <p className="text-lg sm:text-xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            ${transferCollected.toLocaleString()} <span className="text-xs font-normal text-slate-400">MXN</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Conciliación CLABE</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-[#D32421] uppercase tracking-wider block flex items-center gap-1">
            <Store className="w-3.5 h-3.5" />
            En Efectivo OXXO
          </span>
          <p className="text-lg sm:text-xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            ${oxxoCollected.toLocaleString()} <span className="text-xs font-normal text-slate-400">MXN</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Fichas de pago OxxoPay</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          <input
            type="text"
            placeholder="Buscar por alumno, folio o concepto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-transparent border-none focus:outline-hidden text-slate-800 placeholder-slate-400"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="p-1 text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Método:</span>
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'card', label: 'Tarjeta' },
              { id: 'transfer', label: 'SPEI' },
              { id: 'oxxo', label: 'OXXO' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setSelectedMethod(btn.id)}
                className={`px-2.5 py-1 text-xs rounded-lg transition ${
                  selectedMethod === btn.id
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 p-6 space-y-2">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-900">No hay pagos registrados</h3>
            <p className="text-xs text-slate-500">
              No se encontraron registros de cobranza que coincidan con los criterios de búsqueda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Folio & Fecha</th>
                  <th className="py-3 px-4">Alumno & Grupo</th>
                  <th className="py-3 px-4">Concepto Escolar</th>
                  <th className="py-3 px-4 text-right">Monto</th>
                  <th className="py-3 px-4">Método de Pago</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-center">Facturación CFDI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono tabular-nums font-bold text-slate-900 block">
                        {tx.folio}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{tx.date}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">{tx.studentName}</span>
                      <span className="text-[11px] text-slate-500">{tx.studentGroup}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {tx.conceptTitle}
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900 text-sm">
                      ${tx.amount.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">MXN</span>
                    </td>

                    <td className="py-3 px-4">
                      {getMethodBadge(tx.method)}
                      {tx.cardLast4 && (
                        <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                          Terminación ****{tx.cardLast4}
                        </span>
                      )}
                      {tx.clabeReference && (
                        <span className="text-[10px] text-slate-400 block font-mono mt-0.5 truncate max-w-[120px]">
                          CLABE: {tx.clabeReference}
                        </span>
                      )}
                      {tx.oxxoReference && (
                        <span className="text-[10px] text-slate-400 block font-mono mt-0.5 truncate max-w-[120px]">
                          Ref: {tx.oxxoReference}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#049643] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Completado
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {tx.hasInvoice ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0694E8] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          <FileCheck className="w-3 h-3" />
                          CFDI Timbrado
                        </span>
                      ) : (
                        <button
                          onClick={() => generateInvoice(tx.id)}
                          className="px-2 py-1 text-[11px] font-semibold text-slate-700 hover:text-[#0694E8] hover:bg-slate-100 border border-slate-300 rounded-md transition"
                          title="Generar factura CFDI 4.0 para este pago"
                        >
                          Timbrar CFDI
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
