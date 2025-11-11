import React from "react";
import { Grid, Paper, Stack, Typography, Chip } from "@mui/material";

const Card: React.FC<React.PropsWithChildren<{ title: string }>> = ({ title, children }) => (
  <Paper sx={{ p: 2, height: "100%" }} variant="outlined">
    <Stack spacing={1}>
      <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
        {title}
      </Typography>
      {children}
    </Stack>
  </Paper>
);

const DashboardPage: React.FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card title="CSAT this month">
          <Typography variant="h3" fontWeight={700}>95%</Typography>
          <Typography variant="body2" color="text.secondary">Target: 90%+</Typography>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card title="Tickets by status this week">
          <Stack direction="row" spacing={1}>
            <Chip label="Open 230" color="info" />
            <Chip label="Resolved 589" color="success" />
          </Stack>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card title="QA this week">
          <Typography variant="h3" fontWeight={700}>88%</Typography>
          <Typography variant="body2" color="text.secondary">Avg. team score</Typography>
        </Card>
      </Grid>

      <Grid size={12}>
        <Card title="Ticket volume this week">
          <Typography variant="body2" color="text.secondary">
            (placeholder לגרף — נחבר בהמשך)
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardPage;
