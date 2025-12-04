// Support-related types

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

export interface FAQCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface ContactOption {
  id: number;
  icon: string;
  title: string;
  description: string;
  action: string;
  actionUrl?: string;
}

export interface SystemStatus {
  operational: boolean;
  lastUpdate: string;
  message: string;
}

export interface Ticket {
  id: number;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketRequest {
  subject: string;
  message: string;
  category: string;
}
