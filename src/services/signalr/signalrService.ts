// src/services/signalr/signalrService.ts
import * as signalR from "@microsoft/signalr";
import type { ITicket } from "../../interfaces/tickets";

type Handler<T> = (payload: T) => void;

export type SignalREvents = {
  TicketCreated: ITicket;
  TicketUpdated: ITicket;
  TicketStatusChanged: { id: number; status: string; previousStatus?: string | null };
  TicketDeleted: { id: number };
};

let connection: signalR.HubConnection | null = null;
let startPromise: Promise<void> | null = null;

const handlers: { [K in keyof SignalREvents]: Set<Handler<SignalREvents[K]>> } = {
  TicketCreated: new Set(),
  TicketUpdated: new Set(),
  TicketStatusChanged: new Set(),
  TicketDeleted: new Set(),
};

export function on<K extends keyof SignalREvents>(event: K, fn: Handler<SignalREvents[K]>) {
  handlers[event].add(fn);
  return () => handlers[event].delete(fn);
}

export function off<K extends keyof SignalREvents>(event: K, fn: Handler<SignalREvents[K]>) {
  handlers[event].delete(fn);
}

export function once<K extends keyof SignalREvents>(event: K, fn: Handler<SignalREvents[K]>) {
  const wrapper: Handler<SignalREvents[K]> = (p) => {
    handlers[event].delete(wrapper);
    fn(p);
  };
  handlers[event].add(wrapper);
  return () => handlers[event].delete(wrapper);
}

export async function startSignalR() {
  if (connection && connection.state === signalR.HubConnectionState.Connected) return;
  if (startPromise) return startPromise;

  const base = (import.meta.env.VITE_SIGNALR_URL as string) || "";
  connection = new signalR.HubConnectionBuilder().withUrl(base).withAutomaticReconnect().build();

  connection.on("TicketCreated", (p) => handlers.TicketCreated.forEach((h) => h(p)));
  connection.on("TicketUpdated", (p) => handlers.TicketUpdated.forEach((h) => h(p)));
  connection.on("TicketStatusChanged", (p) => handlers.TicketStatusChanged.forEach((h) => h(p)));
  connection.on("TicketDeleted", (p) => handlers.TicketDeleted.forEach((h) => h(p)));

  startPromise = connection
    .start()
    .finally(() => {
      startPromise = null;
    });

  return startPromise;
}

export async function stopSignalR() {
  if (!connection) return;
  if (connection.state !== signalR.HubConnectionState.Disconnected) {
    await connection.stop();
  }
  connection = null;
}

export function isConnected() {
  return !!connection && connection.state === signalR.HubConnectionState.Connected;
}

export function getConnection() {
  return connection;
}
