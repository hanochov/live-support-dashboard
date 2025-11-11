import http from "./http";
import type {
  ITicket,
  ITicketListQuery,
  IUpdateTicketRequest,
  IUpdateTicketStatusApiRequest,
} from "../../interfaces/tickets";
import type { IAssignTicketRequest } from "../../interfaces/agents";
import type { ICreateTicketApiRequest } from "../../interfaces/tickets";

/** GET /api/tickets?status=&priority=&search=&agentId= */
export async function listTickets(q: ITicketListQuery = {}): Promise<ITicket[]> {
  const params: Record<string, string> = {};
  if (q.status && q.status !== "All") params.status = String(q.status);
  if (q.priority && q.priority !== "All") params.priority = String(q.priority);
  if (q.search && q.search.trim()) params.search = q.search.trim();

  const res = await http.get<ITicket[]>("/api/tickets", { params });
  return res.data;
}

/** GET /api/tickets/{id} */
export async function getTicket(id: number | string): Promise<ITicket> {
  const res = await http.get<ITicket>(`/api/tickets/${id}`);
  return res.data;
}

/** POST /api/tickets */
export async function createTicket(dto: ICreateTicketApiRequest): Promise<ITicket> {
  const res = await http.post<ITicket>("/api/tickets", dto);
  return res.data;
}

/** PUT /api/tickets/{id} */
export async function updateTicket(
  id: number | string,
  dto: IUpdateTicketRequest
): Promise<ITicket> {
  const res = await http.put<ITicket>(`/api/tickets/${id}`, dto);
  return res.data;
}

/** PATCH /api/tickets/{id}/status */
export async function updateTicketStatus(
  id: number | string,
  dto: IUpdateTicketStatusApiRequest
): Promise<ITicket> {
  const res = await http.patch<ITicket>(`/api/tickets/${id}/status`, dto);
  return res.data;
}

/** DELETE /api/tickets/{id} */
export async function deleteTicket(id: number | string): Promise<void> {
  await http.delete(`/api/tickets/${id}`);
}

/** PATCH /api/tickets/{id}/assign */
export async function assignTicket(
  id: number | string,
  payload: IAssignTicketRequest
): Promise<void> {
  await http.patch(`/api/tickets/${id}/assign`, payload);
}
