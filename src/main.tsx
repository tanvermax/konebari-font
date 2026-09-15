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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      
    <ThemeProvider  defaultTheme="system" storageKey="vite-ui-theme">
      <PersistGate loading={null} persistor={persistor}>
        

      <RouterProvider router={router}/>
      
       <Toaster richColors />
      </PersistGate>

    </ThemeProvider>
    </ReduxProvider>
  </StrictMode>,
)
