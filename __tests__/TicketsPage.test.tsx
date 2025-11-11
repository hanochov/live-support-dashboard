import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

// --- Mocks for API calls ---
jest.mock('../src/services/api/ticketsApi', () => ({
  listTickets: jest.fn().mockResolvedValue([
    {
      id: 1,
      title: 'Login bug',
      description: 'Cannot login on mobile',
      status: 'Open',
      priority: 'High',
      agentId: null,
      agentName: null,
    },
    {
      id: 2,
      title: 'Payment issue',
      description: 'Card declined erroneously',
      status: 'InProgress',
      priority: 'Medium',
      agentId: 7,
      agentName: 'Alex',
    },
  ]),
  assignTicket: jest.fn().mockResolvedValue({ ok: true }),
}));

// --- Mock store hooks (selector returns default filters) ---
jest.mock('../src/store', () => ({
  __esModule: true,
  useAppDispatch: () => jest.fn(),
  useAppSelector: (selector: any) =>
    selector({
      ui: {
        filters: {
          status: 'All',
          priority: 'All',
          agentId: null,
          search: '',
        },
      },
    }),
}));

// --- Mock selector module shape (kept for compatibility) ---
jest.mock('../src/store/selectors', () => ({
  selectFilters: (state: any) => state.ui.filters,
}));

// --- Mock child components to keep test focused ---
jest.mock('../src/components/AgentPicker/AgentPicker', () => ({
  __esModule: true,
  default: ({ value }: { value: number | null }) => (
    <div data-testid="agent-picker">{value === null ? 'Unassigned' : value}</div>
  ),
}));

jest.mock('../src/components/LiveStatus/LiveStatus', () => ({
  __esModule: true,
  default: () => <div data-testid="live-status">LIVE</div>,
}));

// --- Spy on navigation ---
const navigateSpy = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateSpy,
  };
});

// --- Component under test ---
import TicketsPage from '../src/pages/Tickets/TicketsPage';

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });

  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('TicketsPage', () => {
  test('renders list and shows fetched rows', async () => {
    renderWithProviders(<TicketsPage />);

    expect(screen.getByText(/tickets/i)).toBeInTheDocument();
    expect(screen.getByTestId('live-status')).toBeInTheDocument();
    expect(screen.getByText(/loading…/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Login bug')).toBeInTheDocument();
      expect(screen.getByText('Payment issue')).toBeInTheDocument();
    });

    expect(screen.getByText(/showing 2 \/ 2/i)).toBeInTheDocument();
  });

  test('navigates to new ticket form', async () => {
    renderWithProviders(<TicketsPage />);
    const btn = await screen.findByRole('button', { name: /new ticket/i });
    await userEvent.click(btn);
    expect(navigateSpy).toHaveBeenCalledWith('/tickets/new');
  });
});
