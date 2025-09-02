import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from '@/hooks/use-theme'

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="game-id-checker-theme">
    <App />
  </ThemeProvider>
);
