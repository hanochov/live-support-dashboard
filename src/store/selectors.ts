import type { RootState } from "./index";

export const selectFilters = (s: RootState) => s.ui.filters;
export const selectAgentFilter = (s: RootState) => s.ui.filters.agentId;
export const selectLive = (s: RootState) => s.ui.live;
