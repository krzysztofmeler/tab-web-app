import React, { createContext, FC, useState } from 'react';
import {Link, Outlet} from 'react-router-dom';
import { AuthContext, AuthContextType, AuthData } from '../AuthContextType';

const Page: FC = () => {
    const [authData, setAuthData] = useState<AuthData | null>(null);

    return (
        // todo
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <AuthContext.Provider value={{ data: authData, update: setAuthData }}>
          <Link to={'/'}>
            <h1>Recipes</h1>
          </Link>

          <nav>
            <Link to={'/recipes'}>Recipe list</Link>
            <Link to={'/sign-in'}>Login</Link>
          </nav>
            <Outlet />
            <footer>&copy; recipes.inc whatever</footer>
        </AuthContext.Provider>
    );
};

export { Page };
