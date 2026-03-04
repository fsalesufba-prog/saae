// Re-exporta todos os tipos dos módulos específicos
export * from './user';
export * from './news';
export * from './gallery';
export * from './api';

// Tipos globais compartilhados
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  status: number;
  details?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

export interface MenuItem {
  label: string;
  link?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  onClick?: () => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
  duration?: number;
  read?: boolean;
  created_at: string;
}

export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export interface DateRange {
  start: string | Date;
  end: string | Date;
}

export interface SortConfig<T = string> {
  field: T;
  direction: 'asc' | 'desc';
}

export interface FilterConfig<T = string> {
  field: T;
  value: any;
  operator?: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in';
}

// Tipos de autenticação
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    permissions: Record<string, boolean>;
  };
}

export interface ResetPasswordData {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordData {
  email: string;
}

// Tipos de licitações
export interface Bid {
  id: number;
  process_number: string;
  modality: string;
  object: string;
  status: 'aberta' | 'homologada' | 'fracassada' | 'andamento';
  publish_date: string;
  opening_date: string;
  document_path?: string;
  year: number;
  created_at: string;
  updated_at: string;
}

// Tipos de contratos
export interface Contract {
  id: number;
  year: number;
  process_number: string;
  contract_number: string;
  modality: string;
  object: string;
  status: string;
  published_at: string;
  opening_date: string;
  document_path?: string;
  created_at: string;
  updated_at: string;
}

// Tipos de CIPA
export interface CipaSection {
  id: number;
  section: string;
  title: string;
  content: string;
  file_path?: string;
  order_num: number;
  created_at: string;
  updated_at: string;
}

// Tipos de qualidade da água
export interface WaterQualityReport {
  id: number;
  report_name: string;
  report_file: string;
  report_date: string;
  created_at: string;
}

// Tipos de páginas
export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// Tipos de dicionário
export interface DictionaryTerm {
  id: number;
  term: string;
  definition: string;
  created_at: string;
}

// Tipos de dicas
export interface ConsumptionTip {
  id: number;
  title: string;
  tip: string;
  icon: string;
  order_num: number;
  created_at: string;
}

// Tipos de tarifas
export interface Tariff {
  id: number;
  category: string;
  consumption_range: string;
  tariff_type: 'Água' | 'Esgoto';
  value: number;
  valid_from: string;
  valid_to?: string;
  created_at: string;
}

// Tipos de locais de pagamento
export interface PaymentLocation {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  phone?: string;
  opening_hours?: string;
  created_at: string;
}

// Tipos de telefones úteis
export interface UsefulPhone {
  id: number;
  department: string;
  phone: string;
  email?: string;
  description?: string;
  created_at: string;
}

// Tipos de links úteis
export interface UsefulLink {
  id: number;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  created_at: string;
}

// Tipos de localizações
export interface Location {
  id: number;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  type?: string;
  created_at: string;
}

// Tipos de FAQ
export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  order_num: number;
  created_at: string;
}

// Tipos de configurações
export interface Settings {
  site_title: string;
  site_description: string;
  site_keywords: string;
  address: string;
  phone: string;
  email: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  comunicado_image?: string;
  comunicado_active: boolean;
  analytics_code?: string;
  email_smtp_host?: string;
  email_smtp_port?: string;
  email_smtp_user?: string;
  email_smtp_pass?: string;
  email_from?: string;
  email_from_name?: string;
}

// Tipos de dashboard
export interface DashboardStats {
  users: number;
  news: number;
  galleries: number;
  bids: number;
  pages: number;
  views: number;
}

// Tipos de contato
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Tipos de hidrômetros
export interface Hydrometer {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Tipos de informações técnicas
export interface TechnicalInfo {
  id: number;
  type: 'agua' | 'esgoto';
  title: string;
  content: string;
  created_at: string;
}