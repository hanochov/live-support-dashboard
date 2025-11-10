import React, { useEffect, useState } from "react";
import type { ITicket } from "../../interfaces/tickets";
import { listTickets } from "../../services/api/ticketsApi";

const TicketsPage: React.FC = () => {
  const [data, setData] = useState<ITicket[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listTickets()
      .then(setData)
      .catch((e) => setError(e?.message ?? "error"));
  }, []);

  if (error) return <div style={{ padding: 24 }}>Error: {error}</div>;
  if (!data) return <div style={{ padding: 24 }}>Loading...</div>;
  return <div style={{ padding: 24 }}>Tickets: {data.length}</div>;
};

export default TicketsPage;
