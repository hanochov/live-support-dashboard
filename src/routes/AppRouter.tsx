// src/routes/AppRouter.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TicketsPage from "../pages/Tickets/TicketsPage";
import TicketDetails from "../pages/Tickets/TicketDetails";
import LiveDebugPage from "../pages/Tickets/LiveDebugPage";
import AgentsPage from "../pages/Agents/AgentsPage";
import TicketCreatePage from "../components/TicketForm/TicketCreatePage";


const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tickets" replace />} />
      <Route path="/tickets" element={<TicketsPage />} />
      <Route path="/tickets/new" element={<TicketCreatePage />} />
      <Route path="/tickets/:id" element={<TicketDetails />} />
      <Route path="*" element={<div style={{ padding: 24 }}>404</div>} />
      <Route path="/live" element={<LiveDebugPage />} />
      <Route path="/agents" element={<AgentsPage />} />
      <Route path="*" element={<Navigate to="/tickets" replace />} />

    </Routes>
  );
};

export default AppRouter;
