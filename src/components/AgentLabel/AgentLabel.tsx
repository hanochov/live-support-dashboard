import React, { useMemo } from "react";
import { Chip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { qk } from "../../services/api/queryKeys";
import { listAgents } from "../../services/api/agentsApi";
import type { IAgent } from "../../interfaces/agents";

type Props = {
  agentId: number | null | undefined;
  sx?: object;
  fallbackText?: string;
};

const AgentLabel: React.FC<Props> = ({ agentId, sx, fallbackText }) => {
  const { data, isLoading, isError } = useQuery<IAgent[]>({
    queryKey: qk.agents(),
    queryFn: listAgents,
  });

  const agent = useMemo(() => {
    if (!data || agentId == null) return null;
    return data.find(a => a.id === agentId) ?? null;
  }, [data, agentId]);

  if (isLoading) return <Typography sx={sx} variant="body2">…</Typography>;
  if (isError)   return <Typography sx={sx} variant="body2" color="error">Error</Typography>;

  if (agent) {
    const active = agent.isActive;
    const bg = active ? "rgba(56,189,248,0.25)" : "rgba(148,163,184,0.20)";
    const fg = active ? "#7dd3fc" : "#cbd5e1";
    return (
      <Chip
        label={agent.name}
        size="small"
        sx={{
          bgcolor: bg,
          color: fg,
          fontWeight: 600,
          borderRadius: 0,  
          px: 1,
          py: 0.5,
          height: 24,
          fontSize: 13,
          ...sx,
        }}
      />
    );
  }

  return (
    <Typography sx={sx} variant="body2">
      {fallbackText ?? "Not assigned yet"}
    </Typography>
  );
};

export default AgentLabel;
