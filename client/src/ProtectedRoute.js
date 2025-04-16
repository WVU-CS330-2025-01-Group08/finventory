// Import Navigate from react-router-dom to handle redirecting users
import { Navigate } from 'react-router-dom';

// Import custom authentication context hook to access authentication status
import { useAuth } from './AuthContext';

/*
  Component: ProtectedRoute
  Description:
    This component restricts access to routes that require authentication.
    If the user is authenticated, it renders the child components.
    If not, it redirects the user to the login page.

  Usage:
    Wrap this component around any route component that should be protected.
    Example:
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
*/
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth(); // Check if the user is logged in

    // If authenticated, render the protected children; otherwise, redirect to login
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Export the ProtectedRoute component so it can be used in the app's routing setup
export default ProtectedRoute;
