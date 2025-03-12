import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Signup from './Signup';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
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
            <Route path="/Signup" element={<Signup />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
