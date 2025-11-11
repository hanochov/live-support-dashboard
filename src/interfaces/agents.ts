export interface IAgent {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  ticketIds: number[];
}

export interface ICreateAgentRequest {
  name: string;
  email: string;
}

export interface IAssignTicketRequest {
  agentId: number | null;
}
