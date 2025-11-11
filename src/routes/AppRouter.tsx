import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import TicketsPage from "../pages/Tickets/TicketsPage";
import TicketDetails from "../pages/Tickets/TicketDetails";
import LiveDebugPage from "../pages/Tickets/LiveDebugPage";
import AgentsPage from "../pages/Agents/AgentsPage";
import TicketCreatePage from "../components/TicketForm/TicketCreatePage";
import DashboardPage from "../pages/Dashboard/DashboardPage";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />

        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/tickets/new" element={<TicketCreatePage />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />

        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/live" element={<LiveDebugPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
