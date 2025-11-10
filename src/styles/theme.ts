import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  direction: "ltr",
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
    error: { main: "#d32f2f" },
    warning: { main: "#ed6c02" },
    info: { main: "#0288d1" },
    success: { main: "#2e7d32" }
  },
  typography: {
    fontFamily: '"Rubik", "Segoe UI", "Arial", sans-serif',
    fontSize: 14
  }
});
