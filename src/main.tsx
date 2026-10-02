import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './routes/index.tsx'
import { ThemeProvider } from './providers/theme.provider.tsx'
import {Provider as ReduxProvider } from 'react-redux'
import { persistor, store } from './redux/store.ts'
import { Toaster } from './components/ui/sonner.tsx'
import { PersistGate } from 'redux-persist/integration/react'

import { HelmetProvider } from 'react-helmet-async';


// main.tsx
if (typeof window !== 'undefined') {
  // ✅ Listen for custom render-event from react-snap
  window.addEventListener('render-event', () => {
    // React-snap এই event পেলে HTML snapshot নেবে
    console.log('🎯 render-event fired — ready for snapshot');
  });
}
createRoot(document.getElementById('root')!).render(

  
  <StrictMode>
    <ReduxProvider store={store}>
      <HelmetProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <PersistGate loading={null} persistor={persistor}>
            <RouterProvider router={router} />
            <Toaster richColors />
          </PersistGate>
        </ThemeProvider>
      </HelmetProvider>
    </ReduxProvider>
  </StrictMode>
)
