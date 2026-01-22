
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Critical Render Error during startup:", error);
  // Simple fallback for production environments
  rootElement.innerHTML = `
    <div style="padding: 40px; font-family: sans-serif; text-align: center; color: #666;">
      <h2 style="color: #0ea5e9;">Portfolio Loading Error</h2>
      <p>The application failed to start. Please check the browser console for details.</p>
    </div>
  `;
}
