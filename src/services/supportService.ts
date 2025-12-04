// Support service - FAQ, tickets, and contact operations

import { api } from './api';
import type { FAQ, FAQCategory, ContactOption, SystemStatus, Ticket, CreateTicketRequest } from '@/types';

export interface FAQResponse {
  faqs: FAQ[];
}

export interface ContactResponse {
  options: ContactOption[];
}

export const supportService = {
  // Get all FAQs
  async getFAQs(searchQuery?: string): Promise<FAQResponse> {
    return api.get<FAQResponse>('/faq', searchQuery ? { search: searchQuery } : undefined);
  },

  // Get FAQ categories
  async getFAQCategories(): Promise<FAQCategory[]> {
    return api.get<FAQCategory[]>('/faq/categories');
  },

  // Get FAQs by category
  async getFAQsByCategory(categorySlug: string): Promise<FAQResponse> {
    return api.get<FAQResponse>(`/faq/category/${categorySlug}`);
  },

  // Get contact options
  async getContactOptions(): Promise<ContactResponse> {
    return api.get<ContactResponse>('/support/contact');
  },

  // Get system status
  async getSystemStatus(): Promise<SystemStatus> {
    return api.get<SystemStatus>('/support/status');
  },

  // Create a support ticket
  async createTicket(data: CreateTicketRequest): Promise<Ticket> {
    return api.post<Ticket>('/support/tickets', data);
  },

  // Get user's tickets
  async getTickets(): Promise<Ticket[]> {
    return api.get<Ticket[]>('/support/tickets');
  },

  // Get ticket by ID
  async getTicketById(ticketId: number): Promise<Ticket> {
    return api.get<Ticket>(`/support/tickets/${ticketId}`);
  },
};

export default supportService;
