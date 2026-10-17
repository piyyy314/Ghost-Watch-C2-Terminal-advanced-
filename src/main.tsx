import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept and suppress benign HMR/WebSocket errors in the sandboxed preview environment
if (typeof window !== "undefined") {
  const ignorePatterns = ["WebSocket", "failed to connect", "vite", "hmr"];
  
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    if (reason) {
      const message = reason.message || String(reason);
      const stack = reason.stack || "";
      if (ignorePatterns.some(pat => message.includes(pat) || stack.includes(pat))) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  });

  window.addEventListener("error", (event) => {
    const message = event.message || "";
    if (ignorePatterns.some(pat => message.includes(pat))) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
