import { createContext } from 'react';

enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

type AuthData = {
    email: string;
    password: string;
    roles: Role[];
};

type AuthContextType = {
    data: AuthData | null;
    update: (authData: AuthData) => void;
};

const AuthContext = createContext<AuthContextType>({
    data: null,
    update: () => {},
});

export { AuthContext, Role };
export type { AuthData, AuthContextType };
