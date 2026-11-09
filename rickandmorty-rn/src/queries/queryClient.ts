import NetInfo from '@react-native-community/netinfo';
import { QueryClient, onlineManager } from '@tanstack/react-query';
import { ApiError } from '../api/client';

// Sem internet, o TanStack pausa as consultas em vez de errar, e retoma sozinho quando a rede volta.
onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => setOnline(state.isConnected !== false)),
);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Os dados da API não mudam; 5 min evita refazer a chamada a cada troca de aba.
      staleTime: 5 * 60 * 1000,
      // 404 não melhora tentando de novo.
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.kind === 'not-found') && failureCount < 2,
    },
  },
});
