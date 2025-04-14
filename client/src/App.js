
/**
 * The main App component that sets up the routing and authentication context.
 * 
 * This component uses React Router for navigation and provides protected routes
 * that require authentication. It also wraps the application in an `AuthProvider`
 * to manage authentication state.
 * 
 * Routes:
 * - `/`: Redirects to the `/login` page.
 * - `/login`: Displays the login page.
 * - `/home`: Displays the home page (protected route).
 * - `/account`: Displays the account page (protected route).
 * - `/Signup`: Displays the signup page.
 * - '/Fish': Displays the fish map component.
 * 
 * Protected routes are wrapped with the `ProtectedRoute` component to ensure
 * only authenticated users can access them.
 * 
 * @component
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Signup from './Signup';
import Account from './Account';
import Fish from './components/Map/Fish';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';

function App() { 
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Fish /> 
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
              />
            <Route 
              path="/account" 
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              } 
              />
            <Route path="/Signup" element={<Signup />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
