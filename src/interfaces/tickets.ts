export type TicketStatus = "Open" | "InProgress" | "Resolved";
export type TicketPriority = "Low" | "Medium" | "High" | "Critical";

export interface ITicket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  agentId?: number | null;
  agentName?: string | null;
}


export interface ICreateTicketRequest {
  title: string;
  customerEmail: string;
  description: string;
  priority: TicketPriority;
}

export interface IUpdateTicketStatusApiRequest {
  status: number; 
}

export interface IUpdateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
  
}

export interface ICreateTicketApiRequest {
  title: string;
  description?: string;
  customerEmail: string;
  priority: number; 
}


export interface IUpdateTicketStatusRequest {
  status: TicketStatus;
}

export interface ITicketListQuery {
  status?: TicketStatus | "All";
  priority?: TicketPriority | "All";
  search?: string;
}
