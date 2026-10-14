export type RoleId = 'admin' | 'parent' | 'teacher' | 'student';

export interface RoleInfo {
  id: RoleId;
  name: string;
  badge: string;
  description?: string;
  color: string;
}

export type SchoolGroup = 
  | 'Todos los grupos'
  | 'Maternal A'
  | 'Kinder 1'
  | 'Kinder 2'
  | 'Kinder 3'
  | 'Primaria 1°A'
  | 'Primaria 2°A'
  | 'Primaria 3°B'
  | 'Primaria 4°A'
  | 'Primaria 5°A'
  | 'Primaria 6°A'
  | 'Secundaria 1°A'
  | 'Secundaria 2°B'
  | 'Secundaria 3°A';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  group: SchoolGroup;
  author: string;
  date: string;
  priority: 'normal' | 'importante' | 'urgente';
  readOnly: boolean; // Control de interacción: Solo lectura para padres
  hasAttachment?: boolean;
  attachmentName?: string;
  attachmentUrl?: string;
}

export interface MenuItem {
  id: string;
  dayOfWeek: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';
  date: string;
  mainDish: string;
  sideDish: string;
  soup: string;
  dessert: string;
  drink: string;
  calories: number;
  allergens: string[]; // ['Lácteos', 'Gluten', 'Nueces', 'Huevo']
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  targetGroup: SchoolGroup;
  dressCode?: string;
  requiresConfirmation?: boolean;
  category: 'académico' | 'cultural' | 'deportivo' | 'festivo' | 'administrativo';
}

export type PaymentMethodType = 'card' | 'transfer' | 'oxxo';
export type PaymentStatusType = 'completado' | 'pendiente' | 'en_validacion';

export interface PaymentConcept {
  id: string;
  title: string;
  studentName: string;
  studentGroup: SchoolGroup;
  dueDate: string;
  amount: number;
  status: PaymentStatusType;
  month: string;
}

export interface PaymentTransaction {
  id: string;
  folio: string;
  conceptTitle: string;
  studentName: string;
  studentGroup: SchoolGroup;
  amount: number;
  method: PaymentMethodType;
  status: PaymentStatusType;
  date: string;
  // Specific details
  cardLast4?: string;
  cardBrand?: string;
  clabeReference?: string;
  oxxoBarcode?: string;
  oxxoReference?: string;
  receiptUrl?: string;
  // Invoice link
  invoiceId?: string;
  hasInvoice: boolean;
}

export interface FiscalData {
  rfc: string;
  razonSocial: string;
  regimenFiscal: string;
  codigoPostal: string;
  usoCFDI: string;
  email: string;
  curpAlumno?: string;
  nivelEducativo?: string;
}

export interface InvoiceRecord {
  id: string;
  uuid: string; // Folio Fiscal SAT
  folioInterno: string;
  fechaEmision: string;
  paymentId: string;
  studentName: string;
  total: number;
  subtotal: number;
  iva: number;
  rfcReceptor: string;
  razonSocialReceptor: string;
  usoCFDI: string;
  statusSAT: 'timbrada' | 'pendiente' | 'cancelada';
  pdfGenerated: boolean;
  xmlGenerated: boolean;
}
