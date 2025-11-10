
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TicketStatus = "Open" | "InProgress" | "Resolved" | "All";
export type TicketPriority = "Low" | "Medium" | "High" | "Critical" | "All";

export interface UiState {
  filters: {
    status: TicketStatus;
    priority: TicketPriority;
    search: string;
  };
  modals: {
    createOpen: boolean;
    editOpen: boolean;
    drawerOpen: boolean;
  };
  live: {
    connected: boolean;
    reconnecting: boolean;
    error?: string | null;
  };
}

const initialState: UiState = {
  filters: { status: "All", priority: "All", search: "" },
  modals: { createOpen: false, editOpen: false, drawerOpen: false },
  live: { connected: false, reconnecting: false, error: null },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setStatusFilter(state, action: PayloadAction<TicketStatus>) {
      state.filters.status = action.payload;
    },
    setPriorityFilter(state, action: PayloadAction<TicketPriority>) {
      state.filters.priority = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },
    openCreate(state) {
      state.modals.createOpen = true;
    },
    closeCreate(state) {
      state.modals.createOpen = false;
    },
    openEdit(state) {
      state.modals.editOpen = true;
    },
    closeEdit(state) {
      state.modals.editOpen = false;
    },
    openDrawer(state) {
      state.modals.drawerOpen = true;
    },
    closeDrawer(state) {
      state.modals.drawerOpen = false;
    },
    liveConnected(state) {
      state.live.connected = true;
      state.live.reconnecting = false;
      state.live.error = null;
    },
    liveReconnecting(state) {
      state.live.connected = false;
      state.live.reconnecting = true;
    },
    liveError(state, action: PayloadAction<string | null>) {
      state.live.connected = false;
      state.live.reconnecting = false;
      state.live.error = action.payload ?? "unknown";
    },
  },
});

export const {
  setStatusFilter,
  setPriorityFilter,
  setSearch,
  openCreate, closeCreate,
  openEdit, closeEdit,
  openDrawer, closeDrawer,
  liveConnected, liveReconnecting, liveError,
} = uiSlice.actions;

export default uiSlice.reducer;
