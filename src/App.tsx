import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LeadProvider } from './contexts/LeadContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LeadDetailPage from './pages/LeadDetailPage';
import SettingsPage from './pages/SettingsPage';
import { initializeData } from './utils/localStorage';
import { handleWebhookRequest } from './api/webhook';

// Initialize sample data
initializeData();

function App() {
  // Setup webhook route handler
  useEffect(() => {
    const setupRoutes = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // Check if we can register a service worker for API routing
          // This won't work in StackBlitz's WebContainer environment as is,
          // but in a real environment it would handle the webhook
          console.log("In a real environment, we would setup service worker for API routes");
        } catch (error) {
          console.error("Failed to register service worker:", error);
        }
      }

      // For demo purposes, we'll mock the API endpoint
      // In a real app, we'd use a service worker or server endpoint
      const originalFetch = window.fetch;
      window.fetch = async function(input, init) {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
        
        if (url.endsWith('/api/novo-lead')) {
          // Handle webhook requests
          const request = new Request(url, init);
          return handleWebhookRequest(request);
        }
        
        // Otherwise, use the original fetch
        return originalFetch.apply(this, [input, init]);
      };
    };
    
    setupRoutes();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <LeadProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/lead/:id" element={<LeadDetailPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </LeadProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;