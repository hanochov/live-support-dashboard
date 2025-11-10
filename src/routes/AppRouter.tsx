// src/routes/AppRouter.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TicketsPage from "../pages/Tickets/TicketsPage";
import TicketDetails from "../pages/Tickets/TicketDetails";
import LiveDebugPage from "../pages/Tickets/LiveDebugPage";


const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tickets" replace />} />
      <Route path="/tickets" element={<TicketsPage />} />
      <Route path="/tickets/:id" element={<TicketDetails />} />
      <Route path="*" element={<div style={{ padding: 24 }}>404</div>} />
      <Route path="/live" element={<LiveDebugPage />} />

    </Routes>
  );
};

export default AppRouter;
