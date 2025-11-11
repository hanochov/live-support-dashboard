import type { ITicket, TicketPriority, TicketStatus } from "../interfaces/tickets";

export const StatusNumToText: Record<number, TicketStatus> = {
  0: "Open",
  1: "InProgress",
  2: "Resolved",
};

export const PriorityNumToText: Record<number, TicketPriority> = {
  0: "Low",
  1: "Medium",
  2: "High",
  3: "Critical",
};

export function normalizeTicket(raw: ITicket): ITicket {
  const status =
    typeof raw.status === "number" ? StatusNumToText[raw.status] : (raw.status as TicketStatus);

  const priority =
    typeof raw.priority === "number" ? PriorityNumToText[raw.priority] : (raw.priority as TicketPriority);

  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? "",
    status,
    priority,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    agentId: raw.agentId ?? null,
    agentName: raw.agentName ?? null,
  };
}

export function normalizeTickets(arr: ITicket[]): ITicket[] {
  return (arr ?? []).map(normalizeTicket);
}
