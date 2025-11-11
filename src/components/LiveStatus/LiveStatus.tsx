import React from "react";
import { Chip } from "@mui/material";
import { useAppSelector } from "../../store";
import { selectLive } from "../../store/selectors";


const LiveStatus: React.FC = () => {
  const live = useAppSelector(selectLive);

  if (live.reconnecting) return <Chip label="Reconnecting…" color="warning" size="small" />;
  if (live.connected) return <Chip label="Connected" color="success" size="small" />;
  return <Chip label={live.error ? `Disconnected: ${live.error}` : "Disconnected"} color="error" size="small" />;
};

export default LiveStatus;
