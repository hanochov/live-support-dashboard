import React, { useMemo } from "react";
import {
  Box,

  Paper,
  Stack,
  Typography,
  Avatar,
  useTheme,
  Grid,
} from "@mui/material";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { useQuery } from "@tanstack/react-query";
import { listTickets } from "../../services/api/ticketsApi";
import { qk } from "../../services/api/queryKeys";
import type { ITicket } from "../../interfaces/tickets";

type StatCardProps = {
  value: number | string;
  label: string;
  icon: React.ReactNode;
  color: "primary" | "success" | "info" | "error";
};

const StatCard: React.FC<StatCardProps> = ({ value, label, icon, color }) => {
  const theme = useTheme();
  const palette = theme.palette[color];

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        height: "100%",
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-around" sx={{ height: "100%" }}>
        <Box sx={{ flexGrow: 0.5 }}>
          <Typography variant="h4" fontWeight={700} lineHeight={1}>
            {value}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.6 }}
          >
            {label}
          </Typography>
        </Box>

        <Avatar
          sx={{
            
            bgcolor: palette.main,
            color: theme.palette.getContrastText(palette.main),
            width: 48,
            height: 48,
          }}
          variant="circular"
        >
          {icon}
        </Avatar>
      </Stack>
    </Paper>
  );
};

const StatCards: React.FC = () => {
  const { data, isLoading, isError } = useQuery<ITicket[]>({
    queryKey: qk.tickets(),
    queryFn: () => listTickets(),
  });

  const { total, critical, inProgress, resolved } = useMemo(() => {
    const items = data ?? [];
    return {
      total: items.length,
      critical: items.filter((t) => t.priority === "Critical").length,
      inProgress: items.filter((t) => t.status === "InProgress").length,
      resolved: items.filter((t) => t.status === "Resolved").length,
    };
  }, [data]);

  const safe = (n: number) => (isLoading || isError ? 0 : n);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          value={safe(total)}
          label="Total tickets"
          icon={<ConfirmationNumberOutlinedIcon />}
          color="primary"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          value={safe(critical)}
          label="Critical"
          icon={<PriorityHighOutlinedIcon />}
          color="error"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          value={safe(inProgress)}
          label="In progress"
          icon={<AutorenewOutlinedIcon />}
          color="info"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          value={safe(resolved)}
          label="Resolved"
          icon={<TaskAltOutlinedIcon />}
          color="success"
        />
      </Grid>
    </Grid>
  );
};

export default StatCards;
