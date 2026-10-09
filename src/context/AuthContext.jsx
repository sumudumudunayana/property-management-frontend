import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {

        const savedUser = localStorage.getItem('user');

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });

    const login = (authResponse) => {

        localStorage.setItem(
            'token',
            authResponse.token
        );

        localStorage.setItem(
            'user',
            JSON.stringify({
                userId: authResponse.userId,
                name: authResponse.name,
                email: authResponse.email,
                role: authResponse.role
            })
        );

        setUser({
            userId: authResponse.userId,
            name: authResponse.name,
            email: authResponse.email,
            role: authResponse.role
        });
    };

    const logout = () => {

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);