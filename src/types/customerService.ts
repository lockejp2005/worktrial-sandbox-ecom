export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId?: string;
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  subject: string;
  description: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'order_inquiry' | 'product_question' | 'shipping_issue' | 'return_request' | 'technical_support' | 'billing' | 'other';
  assignedTo?: string;
  orderId?: string;
  productId?: string;
  
  messages: TicketMessage[];
  tags: string[];
  
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  
  satisfaction?: {
    rating: number;
    feedback?: string;
    submittedAt: Date;
  };
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'customer' | 'agent' | 'system';
  senderName: string;
  content: string;
  attachments?: MessageAttachment[];
  isInternal: boolean;
  createdAt: Date;
}

export interface MessageAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
}

export interface SupportAgent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: 'agent' | 'supervisor' | 'admin';
  department: string;
  skills: string[];
  status: 'online' | 'away' | 'busy' | 'offline';
  activeTickets: number;
  maxTickets: number;
  responseTime: number; // average in minutes
  satisfactionRating: number;
}

export interface CustomerServiceAnalytics {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  averageResponseTime: number; // in minutes
  averageResolutionTime: number; // in hours
  satisfactionRating: number;
  ticketsByCategory: Record<string, number>;
  ticketsByPriority: Record<string, number>;
  agentPerformance: Array<{
    agentId: string;
    name: string;
    ticketsResolved: number;
    averageResponseTime: number;
    satisfactionRating: number;
  }>;
  trendsData: Array<{
    date: string;
    newTickets: number;
    resolvedTickets: number;
    responseTime: number;
  }>;
}

export interface LiveChat {
  id: string;
  customerId?: string;
  customerInfo: {
    name: string;
    email: string;
    ip?: string;
    userAgent?: string;
    currentPage?: string;
  };
  agentId?: string;
  status: 'waiting' | 'active' | 'ended';
  messages: ChatMessage[];
  startedAt: Date;
  endedAt?: Date;
  rating?: number;
  feedback?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderType: 'customer' | 'agent' | 'bot';
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  helpful: number;
  notHelpful: number;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: string;
}