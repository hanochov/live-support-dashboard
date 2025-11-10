import React, { useEffect, useState } from "react";
import { startSignalR, on } from "../../services/signalr/signalrService";

const LiveDebugPage: React.FC = () => {
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const add = (msg: string) => setLog((prev) => [...prev, msg]);

    startSignalR().then(() => add("Connected to SignalR"));

    const off1 = on("TicketCreated", (t) => add("Created: " + JSON.stringify(t)));
    const off2 = on("TicketUpdated", (t) => add("Updated: " + JSON.stringify(t)));
    const off3 = on("TicketStatusChanged", (t) => add("Status: " + JSON.stringify(t)));
    const off4 = on("TicketDeleted", (t) => add("Deleted: " + JSON.stringify(t)));

    return () => {
      off1();
      off2();
      off3();
      off4();
    };
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
      <h3>SignalR Live Log</h3>
      {log.map((m, i) => (
        <div key={i}>{m}</div>
      ))}
    </div>
  );
};

export default LiveDebugPage;
