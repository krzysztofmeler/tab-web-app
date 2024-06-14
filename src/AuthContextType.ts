import { createContext } from 'react';

type AuthData = {
    email: string;
    password: string;
};

type AuthContextType = {
    data: AuthData | null;
    update: (authData: AuthData) => void;
};

const AuthContext = createContext<AuthContextType>({
    data: null,
    update: () => {},
});

export { AuthContext };
export type { AuthData, AuthContextType };
