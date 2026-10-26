// main.tsx
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./routes/index.tsx";
import { ThemeProvider } from "./providers/theme.provider.tsx";
import { Provider as ReduxProvider } from "react-redux";
import { persistor, store } from "./redux/store.ts";
import { Toaster } from "./components/ui/sonner.tsx";
import { PersistGate } from "redux-persist/integration/react";
import { HelmetProvider } from "react-helmet-async";

// ✅ react-snap event listener
if (typeof window !== "undefined") {
  window.addEventListener("render-event", () => {
    console.log("🎯 render-event fired — ready for snapshot");
  });
}

const App = (
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
);

const rootEl = document.getElementById("root")!;

// ✅ react-snap prerendered HTML thakle hydrate, na thakle render
if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, App);
} else {
  createRoot(rootEl).render(App);
}