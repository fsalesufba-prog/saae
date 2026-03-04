import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: any;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storageUser = localStorage.getItem('@SAAE:user');
        const storageToken = localStorage.getItem('@SAAE:token');

        if (storageUser && storageToken) {
          api.defaults.headers.Authorization = `Bearer ${storageToken}`;
          setUser(JSON.parse(storageUser));
        }
      } catch (error) {
        console.error('Erro ao carregar dados do storage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response.data;
      
      localStorage.setItem('@SAAE:token', token);
      localStorage.setItem('@SAAE:user', JSON.stringify(user));
      
      api.defaults.headers.Authorization = `Bearer ${token}`;
      
      setUser(user);
    } catch (error) {
      throw new Error('Falha na autenticação');
    }
  };

  const signOut = () => {
    localStorage.removeItem('@SAAE:token');
    localStorage.removeItem('@SAAE:user');
    api.defaults.headers.Authorization = '';
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        signIn, 
        signOut, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};