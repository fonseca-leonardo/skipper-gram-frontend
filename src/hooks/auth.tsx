import React, { createContext, useCallback, useState, useContext } from 'react';
import { LocalStorageKeys } from '../constants';

interface UserData {
  _id: string;

  email: string;

  name: string;
}

interface AuthState {
  token?: string;
  user?: UserData;
}

interface SignInCredentials {
  token?: string;

  user?: UserData;
}

interface AuthContextData {
  user?: UserData;
  token?: string;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem(LocalStorageKeys.TOKEN);
    const user = localStorage.getItem(LocalStorageKeys.USER);

    if (token) {
      return { token };
    }

    if (user) {
      return { user: JSON.parse(user) };
    }

    if (user && token) {
      return { user: JSON.parse(user), token };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ token, user }) => {
    localStorage.setItem(LocalStorageKeys.TOKEN, token);
    
    if (user) {
      localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(user));
    }


    setData(prev => ({ ...prev, token, user: user }));
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(LocalStorageKeys.TOKEN);
    localStorage.removeItem(LocalStorageKeys.USER);

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, token: data.token ,signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export { AuthProvider, useAuth };
