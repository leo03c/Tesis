/**
 * Support Service - API endpoints for help/support/FAQ
 * Backend base: /api/support/
 * 
 * NOTE: Frontend was calling /api/faq which should be /api/support/faq/
 */
import api from './api';

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

export interface FAQCategory {
  id: number;
  name: string;
  icon?: string;
}

export interface FAQResponse {
  results: FAQ[];
  count: number;
  next?: string;
  previous?: string;
}

export interface SupportStatus {
  operational: boolean;
  message?: string;
  last_updated: string;
}

export interface ContactOption {
  id: number;
  icon: string;
  title: string;
  description: string;
  action: string;
  action_url?: string;
}

export interface SupportTicket {
  id: number;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at?: string;
}

export interface CreateTicketData {
  subject: string;
  description: string;
  category?: string;
}

/**
 * Get FAQs
 * Backend endpoint: /api/support/faq/
 */
export const getFaqs = (params?: Record<string, string | number | boolean>) => 
  api.get<FAQResponse>('/support/faq', params);

/**
 * Get FAQ categories
 * Backend endpoint: /api/support/faq/categories/
 */
export const getFaqCategories = () => 
  api.get<FAQCategory[]>('/support/faq/categories');

/**
 * Search FAQs
 */
export const searchFaqs = (query: string) => 
  api.get<FAQResponse>('/support/faq', { search: query });

/**
 * Get support system status
 * Backend endpoint: /api/support/status/
 */
export const getSupportStatus = () => 
  api.get<SupportStatus>('/support/status');

/**
 * Get contact options
 * Backend endpoint: /api/support/contact/
 */
export const getContactOptions = () => 
  api.get<ContactOption[]>('/support/contact');

/**
 * Create a support ticket
 * Backend endpoint: /api/support/tickets/
 */
export const createTicket = (data: CreateTicketData) => 
  api.post<SupportTicket>('/support/tickets', data);

/**
 * Get user's support tickets
 * Backend endpoint: /api/support/tickets/
 */
export const getTickets = () => 
  api.get<SupportTicket[]>('/support/tickets');

/**
 * Get a specific ticket by ID
 * Backend endpoint: /api/support/tickets/{id}/
 */
export const getTicket = (id: number) => 
  api.get<SupportTicket>(`/support/tickets/${id}`);

const supportService = {
  getFaqs,
  getFaqCategories,
  searchFaqs,
  getSupportStatus,
  getContactOptions,
  createTicket,
  getTickets,
  getTicket,
};

export default supportService;
