
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

/**
 * AuthProvider component that provides authentication context to its children.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will have access to the authentication context.
 *
 * @returns {JSX.Element} The AuthContext.Provider component wrapping the children with authentication context.
 */
export const AuthProvider = ({ children }) => { 
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State to manage authentication status

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);
 /** The AuthContext.Provider component provides the authentication context to its children. */
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>  
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 
