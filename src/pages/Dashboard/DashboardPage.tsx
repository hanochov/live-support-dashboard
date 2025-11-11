import React from "react";
import { Box } from "@mui/material";
import StatCards from "../../components/Dashboard/StatCards";
import TicketsPage from "../Tickets/TicketsPage";
import DailyIssuesChart from "../../components/Dashboard/DailyIssuesChart";


const DashboardPage: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
      <StatCards />
      <TicketsPage />
      <DailyIssuesChart />
    </Box>
  );
};

export default DashboardPage;
