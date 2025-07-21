import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import AppContextProvider from './context/AppContext.jsx';

// Simple Error Boundary (add this above your render)
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) { console.error(error); }
  render() { 
    return this.state.hasError 
      ? <div className="p-4 text-red-500">Error occurred</div>
      : this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
