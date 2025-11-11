import http from "./http";
import type {
  ITicket,
  ITicketListQuery,
  ICreateTicketRequest,
  IUpdateTicketRequest,
  IUpdateTicketStatusRequest,
} from "../../interfaces/tickets";
import type { IAssignTicketRequest } from "../../interfaces/agents";

export async function listTickets(
  q: ITicketListQuery = {}
): Promise<ITicket[]> {
  const params: Record<string, string> = {};
  if (q.status && q.status !== "All") params.status = q.status;
  if (q.priority && q.priority !== "All") params.priority = q.priority;
  if (q.search && q.search.trim()) params.search = q.search.trim();
  const res = await http.get<ITicket[]>("/api/tickets", { params });
  return res.data;
}

export async function getTicket(id: string): Promise<ITicket> {
  const res = await http.get<ITicket>(`/api/tickets/${id}`);
  return res.data;
}

export async function createTicket(
  dto: ICreateTicketRequest
): Promise<ITicket> {
  const res = await http.post<ITicket>("/api/tickets", dto);
  return res.data;
}

export async function updateTicket(
  id: string,
  dto: IUpdateTicketRequest
): Promise<ITicket> {
  const res = await http.put<ITicket>(`/api/tickets/${id}`, dto);
  return res.data;
}

export async function updateTicketStatus(
  id: string,
  dto: IUpdateTicketStatusRequest
): Promise<ITicket> {
  const res = await http.patch<ITicket>(`/api/tickets/${id}/status`, dto);
  return res.data;
}

export async function deleteTicket(id: string): Promise<void> {
  await http.delete(`/api/tickets/${id}`);
}

export async function assignTicket(id: number | string, payload: IAssignTicketRequest): Promise<void> {
  await http.patch(`/api/tickets/${id}/assign`, payload);
}