import { QueryClient } from "@tanstack/react-query";
import { on, startSignalR } from "./signalrService";
import { qk } from "../api/queryKeys";


export async function wireSignalR(queryClient: QueryClient) {
  await startSignalR();
  on("TicketCreated", () => queryClient.invalidateQueries({ queryKey: qk.tickets() }));
  on("TicketUpdated", () => queryClient.invalidateQueries({ queryKey: qk.tickets() }));
  on("TicketStatusChanged", () => {
    queryClient.invalidateQueries({ queryKey: qk.tickets() });
  });
  on("TicketDeleted", () => queryClient.invalidateQueries({ queryKey: qk.tickets() }));
}
