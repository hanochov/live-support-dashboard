import React, { useMemo } from "react";
import { Typography } from "@mui/material";
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

  const name = useMemo(() => {
    if (!data || agentId == null) return null;
    const found = data.find(a => a.id === agentId);
    return found ? found.name : null;
  }, [data, agentId]);

  if (isLoading) return <Typography sx={sx} variant="body2">…</Typography>;
  if (isError)   return <Typography sx={sx} variant="body2" color="error">Error</Typography>;

  return (
    <Typography sx={sx} variant="body2">
      {name ?? (fallbackText ?? "לא הוגדר עדיין")}
    </Typography>
  );
};

export default AgentLabel;
