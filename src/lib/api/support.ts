import { apiClient } from './config';
import type { FAQ, SupportTicket, TicketCreateData, PaginatedResponse } from '@/types/api';

// Get FAQs
export async function getFaqs(): Promise<FAQ[]> {
  return apiClient<FAQ[]>('/api/support/faqs/', { requireAuth: false });
}

// Create support ticket
export async function createTicket(data: TicketCreateData): Promise<SupportTicket> {
  return apiClient<SupportTicket>('/api/support/tickets/', {
    method: 'POST',
    body: data,
  });
}

// Get user's tickets
export async function getMyTickets(): Promise<PaginatedResponse<SupportTicket>> {
  return apiClient<PaginatedResponse<SupportTicket>>('/api/support/tickets/my/');
}
