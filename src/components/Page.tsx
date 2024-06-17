import React, { createContext, FC, useEffect, useMemo, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router';
import {
    AuthContext,
    AuthContextType,
    AuthData,
    localStorageKeys,
    Role,
} from '../AuthContextType';

const Page: FC = () => {
    const [authData, setAuthData] = useState<AuthData | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (
            localStorage.getItem(localStorageKeys.email) &&
            localStorage.getItem(localStorageKeys.password) &&
            localStorage.getItem(localStorageKeys.roles) &&
            localStorage.getItem(localStorageKeys.Authorization)
        ) {
            const authDataFromStorage: AuthData = {
                email: localStorage.getItem(localStorageKeys.email)!,
                password: localStorage.getItem(localStorageKeys.password)!,
                roles: localStorage
                    .getItem(localStorageKeys.roles)!
                    .split(',') as Role[],
                Authorization: localStorage.getItem(
                    localStorageKeys.Authorization,
                )!,
            };

            console.dir({ authDataFromStorage });

            setAuthData(authDataFromStorage);
            navigate('/');
        }
    }, []);

    const authDataUpdate = useMemo(
        () => (data: AuthData | null) => {
            if (data) {
                window.localStorage.setItem(localStorageKeys.email, data.email);
                window.localStorage.setItem(
                    localStorageKeys.password,
                    data.password,
                );
                window.localStorage.setItem(
                    localStorageKeys.Authorization,
                    data.Authorization,
                );
                window.localStorage.setItem(
                    localStorageKeys.roles,
                    data.roles.join(','),
                );
            } else {
                window.localStorage.removeItem(localStorageKeys.email);
                window.localStorage.removeItem(localStorageKeys.password);
                window.localStorage.removeItem(localStorageKeys.Authorization);
                window.localStorage.removeItem(localStorageKeys.roles);
            }

            setAuthData(data);
        },
        [],
    );

    const authContextValue = useMemo(
        () => ({ data: authData, update: authDataUpdate }),
        [authData],
    );

    return (
        <AuthContext.Provider value={authContextValue}>
            <Link to="/">
                <h1>Recipes</h1>
            </Link>

            <nav>
                <Link to="/recipes">Recipe list</Link>
                <Link to="/sign-in">Login</Link>
            </nav>
            <Outlet />
            <footer>&copy; recipes.inc whatever</footer>
        </AuthContext.Provider>
    );
};

export { Page };
