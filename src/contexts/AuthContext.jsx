import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Función de inicio de sesión que recibe los datos y la fecha de expiración desde el backend
    const login = (user, token, expirationDate) => {
        // Guarda toda la información en localStorage
        const credentials = {
            user,
            token,
            expirationDate
        };
        localStorage.setItem('credentials_bitacora', JSON.stringify(credentials));

        setUser(user);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('credentials_bitacora');
    };

    // Función para verificar si el token ha expirado
    const isTokenExpired = (expirationDate) => {
        return Date.now() > expirationDate;
    };

    // Función para autenticar al usuario verificando el token en localStorage
    const authenticateUser = () => {
        const storedCredentials = localStorage.getItem('credentials_bitacora');
        
        if (!storedCredentials) {
            setIsLoading(false);
            return;
        }

        const { user, token, expirationDate } = JSON.parse(storedCredentials);
        
        // Verificar si el token ha expirado
        if (isTokenExpired(expirationDate)) {
            logout();
        } else {
            // Si el token es válido, establecer los estados
            setUser(user);
            setIsAuthenticated(true);
        }
        
        setIsLoading(false);
    };

    // Ejecuta la autenticación al montar el componente
    useEffect(() => {
        authenticateUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
