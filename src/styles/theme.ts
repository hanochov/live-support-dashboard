import { createTheme } from "@mui/material/styles";

const bg = {
  default: "#0e1224",   
  paper:   "#161a2b",   
};

export const theme = createTheme({
  direction: "ltr",
  palette: {
    mode: "dark",
    primary:   { main: "#6ee7ff" }, 
    secondary: { main: "#8b5cf6" },
    success:   { main: "#22c55e" },
    warning:   { main: "#f59e0b" },
    error:     { main: "#ef4444" },
    info:      { main: "#38bdf8" },
    background: { ...bg },
    text: {
      primary:   "#e6edf3",
      secondary: "#a9b1c6",
      disabled:  "#7a819a",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Rubik","Segoe UI","Arial",sans-serif',
    fontSize: 14,
    h5: { fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: bg.default,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: bg.paper,
          border: "1px solid rgba(255,255,255,0.06)",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "background-color .15s ease",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.04)" },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", borderRadius: 12, fontWeight: 600 },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 10, fontWeight: 600 } },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: "rgba(255,255,255,0.08)" } },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#14182a",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#14182a",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
    },
  },
});
