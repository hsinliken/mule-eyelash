import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    login: async () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 監聽認證狀態變化
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // 登入函式
    const login = async (email: string, password: string): Promise<void> => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            console.error('Login error:', error);
            // 轉換 Firebase 錯誤訊息為中文
            let message = '登入失敗';
            switch (error.code) {
                case 'auth/user-not-found':
                    message = '找不到此帳號';
                    break;
                case 'auth/wrong-password':
                    message = '密碼錯誤';
                    break;
                case 'auth/invalid-email':
                    message = '無效的電子郵件格式';
                    break;
                case 'auth/invalid-credential':
                    message = '帳號或密碼錯誤';
                    break;
                default:
                    message = error.message || '登入失敗';
            }
            throw new Error(message);
        }
    };

    // 登出函式
    const logout = async (): Promise<void> => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
