import * as signalR from "@microsoft/signalr";

type Handler<T> = (payload: T) => void;

export type SignalREvents = {
  TicketCreated: unknown;
  TicketUpdated: unknown;
  TicketStatusChanged: unknown;
  TicketDeleted: unknown;
};

let connection: signalR.HubConnection | null = null;
const handlers: { [K in keyof SignalREvents]: Set<Handler<SignalREvents[K]>> } = {
  TicketCreated: new Set(),
  TicketUpdated: new Set(),
  TicketStatusChanged: new Set(),
  TicketDeleted: new Set()
};

export function on<K extends keyof SignalREvents>(event: K, fn: Handler<SignalREvents[K]>) {
  handlers[event].add(fn);
  return () => handlers[event].delete(fn);
}

export async function startSignalR() {
  if (connection) return;
  const base = import.meta.env.VITE_SIGNALR_URL as string;
  connection = new signalR.HubConnectionBuilder().withUrl(base).withAutomaticReconnect().build();
  connection.on("TicketCreated", (p) => handlers.TicketCreated.forEach(h => h(p)));
  connection.on("TicketUpdated", (p) => handlers.TicketUpdated.forEach(h => h(p)));
  connection.on("TicketStatusChanged", (p) => handlers.TicketStatusChanged.forEach(h => h(p)));
  connection.on("TicketDeleted", (p) => handlers.TicketDeleted.forEach(h => h(p)));
  await connection.start();
}
