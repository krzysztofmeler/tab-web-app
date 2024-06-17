import React, { FC, useEffect, useMemo, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { Alignment, Button, Navbar, NavbarGroup } from '@blueprintjs/core';
import {
    AuthContext,
    AuthContextType,
    AuthData,
    localStorageKeys,
    Role,
} from '../AuthContextType';
import { jsSubmit } from '../utils/js-submit';

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
            <Navbar>
                <div className="middle">
                    <NavbarGroup align={Alignment.LEFT} className="-fixed">
                        <Navbar.Heading>
                            <Link to="/">Recipes</Link>
                        </Navbar.Heading>
                        <Navbar.Divider />
                        <Button
                          className="bp5-minimal"
                          text="Home"
                          onClick={jsSubmit(() => navigate('/'))}
                          icon="home"
                        />
                        <Button
                          className="bp5-minimal"
                          text="Recipes"
                          onClick={jsSubmit(() => navigate('/recipes'))}
                          icon="list"
                        />
                    </NavbarGroup>

                    <NavbarGroup align={Alignment.RIGHT}>
                        {authData && (
                            <Button
                              className="bp5-minimal"
                              onClick={jsSubmit(() =>
                                    navigate('/my-profile'),
                                )}
                              icon="user"
                            >
                                My profile
                            </Button>
                        )}

                        {authData === null && (
                            <Button
                              onClick={jsSubmit(() => navigate('/sign-in'))}
                              icon="log-in"
                            >
                                Sign in
                            </Button>
                        )}
                    </NavbarGroup>
                </div>
            </Navbar>

            <Outlet />
            <footer>&copy; recipes.inc whatever</footer>
        </AuthContext.Provider>
    );
};

export { Page };
