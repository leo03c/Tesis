/**
 * Support Service - API endpoints for help/support/FAQ
 * Backend base: /api/support/
 */
import api from './api';

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

export interface FAQResponse {
  results: FAQ[];
  count: number;
  next?: string;
  previous?: string;
}

export interface SupportTicket {
  id: number;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at?: string;
}

export interface TicketsResponse {
  results: SupportTicket[];
  count: number;
  next?: string;
  previous?: string;
}

export interface CreateTicketData {
  subject: string;
  message: string;
  category?: string;
}

/**
 * Get FAQs
 * Backend endpoint: /api/support/faqs/
 */
export const getFaqs = (params?: Record<string, string | number | boolean>) => 
  api.get<FAQResponse>('/support/faqs', params);

/**
 * Create a support ticket
 * Backend endpoint: /api/support/tickets/
 */
export const createTicket = (data: CreateTicketData) => 
  api.post<SupportTicket>('/support/tickets', data);

/**
 * Get current user's support tickets
 * Backend endpoint: /api/support/tickets/my/
 */
export const getMyTickets = () => 
  api.get<TicketsResponse>('/support/tickets/my');

/**
 * Get a specific ticket by ID
 * Backend endpoint: /api/support/tickets/{id}/
 */
export const getTicket = (id: number) => 
  api.get<SupportTicket>(`/support/tickets/${id}`);

const supportService = {
  getFaqs,
  createTicket,
  getMyTickets,
  getTicket,
};

export default supportService;
