import React, { createContext, FC, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext, AuthContextType, AuthData } from '../AuthContextType';

const Page: FC = () => {
    const [authData, setAuthData] = useState<AuthData | null>(null);

    return (
        // todo
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <AuthContext.Provider value={{ data: authData, update: setAuthData }}>
            <h1>Recipes</h1>
            <Outlet />
            <footer>&copy; recipes.inc whatever</footer>
        </AuthContext.Provider>
    );
};

export { Page };
