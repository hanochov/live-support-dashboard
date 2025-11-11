import { QueryClient } from "@tanstack/react-query";
import { on, startSignalR, getConnection } from "./signalrService";
import { qk } from "../../services/api/queryKeys";
import type { AppDispatch } from "../../store";
import { liveConnected, liveReconnecting, liveError } from "../../store/uiSlice";

export async function wireUp(queryClient: QueryClient, dispatch: AppDispatch) {
  await startSignalR();

  const conn = getConnection();
  if (conn) {
    conn.onreconnecting(() => dispatch(liveReconnecting()));
    conn.onreconnected(() => dispatch(liveConnected()));
    conn.onclose((e) => dispatch(liveError(e?.message ?? "closed")));
    dispatch(liveConnected());
  }

  on("TicketCreated", () => {
    queryClient.invalidateQueries({ queryKey: qk.tickets() });
  });

  on("TicketUpdated", (t: { id: number }) => {
    queryClient.invalidateQueries({ queryKey: qk.tickets() });
    queryClient.invalidateQueries({ queryKey: qk.ticket(t.id) });
  });

  on("TicketStatusChanged", (t: { id: number }) => {
    queryClient.invalidateQueries({ queryKey: qk.tickets() });
    queryClient.invalidateQueries({ queryKey: qk.ticket(t.id) });
  });

  on("TicketDeleted", () => {
    queryClient.invalidateQueries({ queryKey: qk.tickets() });
  });
}
