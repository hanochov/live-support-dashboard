import React, { useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "../../store";
import { theme } from "../../styles/theme";
import { wireUp } from "../../services/signalr/wireUp";
import { useAppDispatch } from "../../store";

type Props = { children: React.ReactNode };

const queryClient = new QueryClient();

function LiveBoot() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    wireUp(queryClient, dispatch); 
  }, [dispatch]);
  return null;
}


const AppProviders: React.FC<Props> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <LiveBoot />
            {children}
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default AppProviders;
