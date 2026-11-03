import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { queryClient } from './src/queries/queryClient';
import { AppThemeProvider } from './src/theme/AppThemeProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AppThemeProvider>
          <RootNavigator />
        </AppThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
