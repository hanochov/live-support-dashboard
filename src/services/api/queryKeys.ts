export const qk = {
  tickets: (f?: Record<string, unknown>) => ["tickets", f ?? {}] as const,
  ticket: (id: string | number) => ["ticket", id] as const,
  agents: () => ["agents"] as const,
};
