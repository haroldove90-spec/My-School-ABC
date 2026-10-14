import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RoleId,
  Announcement,
  MenuItem,
  SchoolEvent,
  PaymentConcept,
  PaymentTransaction,
  InvoiceRecord,
  FiscalData,
  PaymentMethodType,
  SchoolGroup,
} from '../types';
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_MENU,
  INITIAL_EVENTS,
  INITIAL_PAYMENT_CONCEPTS,
  INITIAL_TRANSACTIONS,
  INITIAL_INVOICES,
  DEFAULT_FISCAL_DATA,
} from '../data/mockData';

interface SchoolContextType {
  currentRole: RoleId | null;
  setCurrentRole: (role: RoleId | null) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  
  // Announcements
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  deleteAnnouncement: (id: string) => void;
  toggleAnnouncementReadOnly: (id: string) => void;
  
  // Menu
  menuItems: MenuItem[];
  updateMenuItem: (item: MenuItem) => void;
  
  // Events
  events: SchoolEvent[];
  addEvent: (event: Omit<SchoolEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;
  
  // Payments
  paymentConcepts: PaymentConcept[];
  transactions: PaymentTransaction[];
  processPayment: (
    conceptId: string,
    method: PaymentMethodType,
    details: {
      cardLast4?: string;
      cardBrand?: string;
      generateInvoiceImmediate?: boolean;
    }
  ) => { transactionId: string; invoiceId?: string };
  validateTransaction: (transactionId: string) => void;
  
  // Invoices
  invoices: InvoiceRecord[];
  fiscalData: FiscalData;
  updateFiscalData: (data: FiscalData) => void;
  generateInvoice: (paymentId: string, customFiscalData?: FiscalData) => InvoiceRecord;
  
  // Data Clearing & Supabase Readiness
  isSampleDisabled: boolean;
  clearAllSampleData: (dontShowAgain: boolean) => void;
  restoreSampleData: () => void;
  
  // Notification toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEYS = {
  DISABLED_FLAG: 'my_school_abc_sample_disabled_v1',
  ANNOUNCEMENTS: 'my_school_abc_announcements_v1',
  MENU: 'my_school_abc_menu_v1',
  EVENTS: 'my_school_abc_events_v1',
  CONCEPTS: 'my_school_abc_concepts_v1',
  TRANSACTIONS: 'my_school_abc_transactions_v1',
  INVOICES: 'my_school_abc_invoices_v1',
  FISCAL: 'my_school_abc_fiscal_v1',
};

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // In sandboxed environments localStorage might be blocked
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Ignore write errors in sandboxed iframes
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignore
    }
  },
};

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<RoleId | null>(null);
  const [activeView, setActiveView] = useState<string>('announcements');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check if user disabled sample data permanently in browser
  const [isSampleDisabled, setIsSampleDisabled] = useState<boolean>(() => {
    return safeStorage.getItem(STORAGE_KEYS.DISABLED_FLAG) === 'true';
  });

  // State data initializers
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const disabled = safeStorage.getItem(STORAGE_KEYS.DISABLED_FLAG) === 'true';
    if (disabled) {
      const stored = safeStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      return stored ? JSON.parse(stored) : [];
    }
    const stored = safeStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return stored ? JSON.parse(stored) : INITIAL_ANNOUNCEMENTS;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const disabled = safeStorage.getItem(STORAGE_KEYS.DISABLED_FLAG) === 'true';
    if (disabled) {
      const stored = safeStorage.getItem(STORAGE_KEYS.MENU);
      return stored ? JSON.parse(stored) : [];
    }
    const stored = safeStorage.getItem(STORAGE_KEYS.MENU);
    return stored ? JSON.parse(stored) : INITIAL_MENU;
  });

  const [events, setEvents] = useState<SchoolEvent[]>(() => {
    const disabled = safeStorage.getItem(STORAGE_KEYS.DISABLED_FLAG) === 'true';
    if (disabled) {
      const stored = safeStorage.getItem(STORAGE_KEYS.EVENTS);
      return stored ? JSON.parse(stored) : [];
    }
    const stored = safeStorage.getItem(STORAGE_KEYS.EVENTS);
    return stored ? JSON.parse(stored) : INITIAL_EVENTS;
  });

  const [paymentConcepts, setPaymentConcepts] = useState<PaymentConcept[]>(() => {
    const disabled = safeStorage.getItem(STORAGE_KEYS.DISABLED_FLAG) === 'true';
    if (disabled) {
      const stored = safeStorage.getItem(STORAGE_KEYS.CONCEPTS);
      return stored ? JSON.parse(stored) : [];
    }
    const stored = safeStorage.getItem(STORAGE_KEYS.CONCEPTS);
    return stored ? JSON.parse(stored) : INITIAL_PAYMENT_CONCEPTS;
  });

  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    const disabled = safeStorage.getItem(STORAGE_KEYS.DISABLED_FLAG) === 'true';
    if (disabled) {
      const stored = safeStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return stored ? JSON.parse(stored) : [];
    }
    const stored = safeStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS;
  });

  const [invoices, setInvoices] = useState<InvoiceRecord[]>(() => {
    const disabled = safeStorage.getItem(STORAGE_KEYS.DISABLED_FLAG) === 'true';
    if (disabled) {
      const stored = safeStorage.getItem(STORAGE_KEYS.INVOICES);
      return stored ? JSON.parse(stored) : [];
    }
    const stored = safeStorage.getItem(STORAGE_KEYS.INVOICES);
    return stored ? JSON.parse(stored) : INITIAL_INVOICES;
  });

  const [fiscalData, setFiscalData] = useState<FiscalData>(() => {
    const stored = safeStorage.getItem(STORAGE_KEYS.FISCAL);
    return stored ? JSON.parse(stored) : DEFAULT_FISCAL_DATA;
  });

  // Sync to local storage
  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.CONCEPTS, JSON.stringify(paymentConcepts));
  }, [paymentConcepts]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.FISCAL, JSON.stringify(fiscalData));
  }, [fiscalData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Add announcement
  const addAnnouncement = (newAnn: Omit<Announcement, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const created: Announcement = {
      ...newAnn,
      id: `ann-${Date.now()}`,
      date: today,
    };
    setAnnouncements((prev) => [created, ...prev]);
    showToast('Aviso publicado exitosamente para el grupo.');
  };

  // Delete announcement
  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Aviso eliminado del muro escolar.');
  };

  // Toggle readOnly interaction control
  const toggleAnnouncementReadOnly = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updatedState = !a.readOnly;
          showToast(
            updatedState
              ? 'Canal configurado en Solo Lectura (Padres no pueden responder)'
              : 'Canal abierto para interacción'
          );
          return { ...a, readOnly: updatedState };
        }
        return a;
      })
    );
  };

  // Menu update
  const updateMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => prev.map((m) => (m.id === item.id ? item : m)));
    showToast(`Menú del día ${item.dayOfWeek} actualizado correctamente.`);
  };

  // Events
  const addEvent = (newEvent: Omit<SchoolEvent, 'id'>) => {
    const created: SchoolEvent = {
      ...newEvent,
      id: `ev-${Date.now()}`,
    };
    setEvents((prev) => [created, ...prev]);
    showToast('Evento escolar agregado al calendario institucional.');
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showToast('Evento eliminado del calendario.');
  };

  // Fiscal data update
  const updateFiscalData = (data: FiscalData) => {
    setFiscalData(data);
    showToast('Datos fiscales actualizados con éxito.');
  };

  // Helper to generate UUID
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16).toUpperCase();
    });
  };

  // Generate Invoice
  const generateInvoice = (paymentId: string, customData?: FiscalData): InvoiceRecord => {
    const tx = transactions.find((t) => t.id === paymentId);
    const dataToUse = customData || fiscalData;
    const amount = tx ? tx.amount : 5450;
    const isTuition = tx?.conceptTitle.toLowerCase().includes('colegiatura') || tx?.conceptTitle.toLowerCase().includes('inscripción');
    
    // In Mexico educational tuition is exempt from IVA (VAT 0%)
    const subtotal = isTuition ? amount : Number((amount / 1.16).toFixed(2));
    const iva = isTuition ? 0 : Number((amount - subtotal).toFixed(2));

    const newInvoice: InvoiceRecord = {
      id: `inv-${Date.now()}`,
      uuid: generateUUID(),
      folioInterno: `F-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      fechaEmision: new Date().toISOString(),
      paymentId: paymentId,
      studentName: tx ? tx.studentName : 'Mateo Sánchez Morales',
      total: amount,
      subtotal: subtotal,
      iva: iva,
      rfcReceptor: dataToUse.rfc.toUpperCase().trim(),
      razonSocialReceptor: dataToUse.razonSocial.toUpperCase().trim(),
      usoCFDI: dataToUse.usoCFDI,
      statusSAT: 'timbrada',
      pdfGenerated: true,
      xmlGenerated: true,
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    // Update transaction to mark invoice generated
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === paymentId
          ? { ...t, hasInvoice: true, invoiceId: newInvoice.id }
          : t
      )
    );

    showToast(`Factura CFDI 4.0 timbrada exitosamente: Folio ${newInvoice.folioInterno}`);
    return newInvoice;
  };

  // Process payment from Parent Portal
  const processPayment = (
    conceptId: string,
    method: PaymentMethodType,
    details: {
      cardLast4?: string;
      cardBrand?: string;
      generateInvoiceImmediate?: boolean;
    }
  ) => {
    const concept = paymentConcepts.find((c) => c.id === conceptId);
    const studentName = concept ? concept.studentName : 'Mateo Sánchez Morales';
    const studentGroup = concept ? concept.studentGroup : 'Primaria 1°A';
    const conceptTitle = concept ? concept.title : 'Pago de Colegiatura';
    const amount = concept ? concept.amount : 5450;

    const txId = `tx-${Date.now()}`;
    const folio = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];

    let newTx: PaymentTransaction = {
      id: txId,
      folio: folio,
      conceptTitle: conceptTitle,
      studentName: studentName,
      studentGroup: studentGroup,
      amount: amount,
      method: method,
      status: 'completado',
      date: today,
      hasInvoice: false,
    };

    if (method === 'card') {
      newTx.cardLast4 = details.cardLast4 || '4242';
      newTx.cardBrand = details.cardBrand || 'Visa Débito';
    } else if (method === 'transfer') {
      newTx.clabeReference = `646180${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    } else if (method === 'oxxo') {
      const code = `${Math.floor(10000000000000 + Math.random() * 90000000000000)}`;
      newTx.oxxoBarcode = code;
      newTx.oxxoReference = `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}-${code.slice(12, 14)}`;
    }

    let invoiceCreatedId: string | undefined = undefined;

    if (details.generateInvoiceImmediate) {
      // Auto invoice on payment
      const isTuition = conceptTitle.toLowerCase().includes('colegiatura') || conceptTitle.toLowerCase().includes('inscripción');
      const subtotal = isTuition ? amount : Number((amount / 1.16).toFixed(2));
      const iva = isTuition ? 0 : Number((amount - subtotal).toFixed(2));

      const inv: InvoiceRecord = {
        id: `inv-${Date.now()}`,
        uuid: generateUUID(),
        folioInterno: `F-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        fechaEmision: new Date().toISOString(),
        paymentId: txId,
        studentName: studentName,
        total: amount,
        subtotal: subtotal,
        iva: iva,
        rfcReceptor: fiscalData.rfc.toUpperCase().trim(),
        razonSocialReceptor: fiscalData.razonSocial.toUpperCase().trim(),
        usoCFDI: fiscalData.usoCFDI,
        statusSAT: 'timbrada',
        pdfGenerated: true,
        xmlGenerated: true,
      };

      invoiceCreatedId = inv.id;
      newTx.hasInvoice = true;
      newTx.invoiceId = inv.id;
      setInvoices((prev) => [inv, ...prev]);
    }

    setTransactions((prev) => [newTx, ...prev]);

    // Update concept status to completado
    setPaymentConcepts((prev) =>
      prev.map((c) => (c.id === conceptId ? { ...c, status: 'completado' } : c))
    );

    showToast(
      method === 'card'
        ? `Pago de $${amount.toLocaleString()} MXN procesado con éxito.`
        : method === 'transfer'
        ? 'Referencia SPEI generada exitosamente.'
        : 'Ficha de pago OXXO Pay generada con código de barras.'
    );

    return { transactionId: txId, invoiceId: invoiceCreatedId };
  };

  const validateTransaction = (txId: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'completado' } : t))
    );
    showToast('Pago validado y confirmado en el sistema contable.');
  };

  // Data reset & Supabase readiness
  const clearAllSampleData = (dontShowAgain: boolean) => {
    setAnnouncements([]);
    setMenuItems([]);
    setEvents([]);
    setPaymentConcepts([]);
    setTransactions([]);
    setInvoices([]);

    safeStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    safeStorage.removeItem(STORAGE_KEYS.MENU);
    safeStorage.removeItem(STORAGE_KEYS.EVENTS);
    safeStorage.removeItem(STORAGE_KEYS.CONCEPTS);
    safeStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    safeStorage.removeItem(STORAGE_KEYS.INVOICES);

    if (dontShowAgain) {
      safeStorage.setItem(STORAGE_KEYS.DISABLED_FLAG, 'true');
      setIsSampleDisabled(true);
    } else {
      safeStorage.removeItem(STORAGE_KEYS.DISABLED_FLAG);
      setIsSampleDisabled(false);
    }

    showToast(
      dontShowAgain
        ? 'Datos de muestra eliminados. El navegador recordará mantener la base de datos limpia para Supabase.'
        : 'Datos de muestra eliminados del sistema.'
    );
  };

  const restoreSampleData = () => {
    safeStorage.removeItem(STORAGE_KEYS.DISABLED_FLAG);
    setIsSampleDisabled(false);

    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setMenuItems(INITIAL_MENU);
    setEvents(INITIAL_EVENTS);
    setPaymentConcepts(INITIAL_PAYMENT_CONCEPTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setInvoices(INITIAL_INVOICES);

    safeStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
    safeStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(INITIAL_MENU));
    safeStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    safeStorage.setItem(STORAGE_KEYS.CONCEPTS, JSON.stringify(INITIAL_PAYMENT_CONCEPTS));
    safeStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    safeStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));

    showToast('Datos de muestra del colegio restaurados exitosamente.');
  };

  return (
    <SchoolContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeView,
        setActiveView,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        toggleAnnouncementReadOnly,
        menuItems,
        updateMenuItem,
        events,
        addEvent,
        deleteEvent,
        paymentConcepts,
        transactions,
        processPayment,
        validateTransaction,
        invoices,
        fiscalData,
        updateFiscalData,
        generateInvoice,
        isSampleDisabled,
        clearAllSampleData,
        restoreSampleData,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
