export type TicketStatus = "Open" | "InProgress" | "Resolved";
export type TicketPriority = "Low" | "Medium" | "High" | "Critical";

export interface ITicket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
}

export interface IUpdateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
}

export interface IUpdateTicketStatusRequest {
  status: TicketStatus;
}

export interface ITicketListQuery {
  status?: TicketStatus | "All";
  priority?: TicketPriority | "All";
  search?: string;
}
