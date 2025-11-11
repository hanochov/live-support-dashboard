import * as React from "react";
import {
  Container, Paper, Stack, Typography, TextField, MenuItem, Button
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTicket } from "../../services/api/ticketsApi";
import type {
  ICreateTicketRequest, ICreateTicketApiRequest, TicketPriority
} from "../../interfaces/tickets";
import { qk } from "../../services/api/queryKeys";
import { useNavigate } from "react-router-dom";

const priorities: TicketPriority[] = ["Low", "Medium", "High", "Critical"];

const PriorityTextToNum: Record<TicketPriority, number> = {
  Low: 0, Medium: 1, High: 2, Critical: 3,
};

const TicketCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [form, setForm] = React.useState<ICreateTicketRequest>({
    title: "",
    description: "",
    priority: "Low",
    customerEmail: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const payload: ICreateTicketApiRequest = {
        title: form.title.trim(),
        description: form.description?.trim() || "",
        customerEmail: form.customerEmail.trim(),
        priority: PriorityTextToNum[form.priority],
      };
      return createTicket(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.tickets() });
      navigate("/tickets");
    },
  });

  const canSubmit =
    form.title.trim().length > 0 &&
    form.customerEmail.trim().length > 0 &&
    priorities.includes(form.priority);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>New Ticket</Typography>

        <Stack spacing={2}>
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            required
            fullWidth
          />

          <TextField
            label="Description"
            value={form.description ?? ""}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            multiline
            minRows={3}
            fullWidth
          />

          <TextField
            label="Customer Email"
            value={form.customerEmail}
            onChange={(e) => setForm((s) => ({ ...s, customerEmail: e.target.value }))}
            type="email"
            required
            fullWidth
          />

          <TextField
            select
            label="Priority"
            value={form.priority}
            onChange={(e) =>
              setForm((s) => ({ ...s, priority: e.target.value as TicketPriority }))
            }
            fullWidth
          >
            {priorities.map((p) => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </TextField>

          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 1 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => mutate()}
              disabled={!canSubmit || isPending}
            >
              {isPending ? "Creating..." : "Create Ticket"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default TicketCreatePage;
