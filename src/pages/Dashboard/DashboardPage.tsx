import React from "react";
import { Box, Divider } from "@mui/material";
import StatCards from "../../components/Dashboard/StatCards";
import TicketsPage from "../Tickets/TicketsPage";


const DashboardPage: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
      <StatCards />


      <TicketsPage />
    </Box>
  );
};

export default DashboardPage;
