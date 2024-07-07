import React, { createContext, FC, useEffect, useMemo, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router';
import {
    AppShell,
    Burger,
    Button,
    Flex,
    Group,
    Image,
    Text,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    AuthContext,
    AuthContextType,
    AuthData,
    localStorageKeys,
    Role,
} from '../AuthContextType';
import settings from '../settings';
import logo from '../assets/my-recipes-logo.png';

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

    const [opened, { toggle }] = useDisclosure();

    const { colors } = useMantineTheme();

    return (
        <AuthContext.Provider value={authContextValue}>
            <AppShell
              header={{ height: 80 }}
                // navbar={{
                //     width: 300,
                //     breakpoint: 'sm',
                //     collapsed: {
                //         mobile: !opened,
                //         desktop: !pathname.startsWith('/administration'),
                //     },
                // }}
              padding="md"
            >
                <AppShell.Header
                  style={{ boxShadow: '0 0 30px 0 rgba(0, 0, 0, 0.15)' }}
                >
                    <Group
                      flex={1}
                      maw={900}
                      mx={'auto'}
                      style={{ justifyContent: 'center' }}
                      h="100%"
                    >
                        <Burger
                          px={30}
                          py={20}
                          mih={60}
                          opened={opened}
                          onClick={toggle}
                          hiddenFrom="sm"
                          size="md"
                        />

                        <Group
                          flex={1}
                          style={{ justifyContent: 'space-between' }}
                          px={10}
                        >
                            <Button
                              variant="subtle"
                              px={14}
                              py={5}
                              mih={60}
                              radius="md"
                              component={Link}
                              to={settings.browserBaseURL}
                            >
                                <Image width={50} h={40} src={logo} />
                            </Button>

                            <Flex
                              justify="space-between"
                              px="md"
                              gap={40}
                              visibleFrom="sm"
                            >
                                <Button
                                  fw={500}
                                  variant="subtle"
                                  component={Link}
                                  to={`${settings.browserBaseURL}/recipes`}
                                >
                                    Recipes
                                </Button>

                                <Button
                                  fw={500}
                                  variant="subtle"
                                  component={Link}
                                  to={`${settings.browserBaseURL}/sign-in`}
                                >
                                    Sign in
                                </Button>
                            </Flex>
                        </Group>
                    </Group>
                </AppShell.Header>

                {/* <AppShell.Navbar p="md"> */}
                {/*    {AdminAreaLinks.map((link) => ( */}
                {/*      <Button */}
                {/*        c="#222" */}
                {/*        fw={400} */}
                {/*        mih={58} */}
                {/*        ta="left" */}
                {/*        key={link.link + link.text} */}
                {/*        component={Link} */}
                {/*        to={link.link} */}
                {/*        variant="subtle" */}
                {/*        style={{ display: 'flex', alignItems: 'left' }} */}
                {/*        px={14} */}
                {/*      > */}
                {/*          {link.text} */}
                {/*      </Button> */}
                {/*    ))} */}
                {/* </AppShell.Navbar> */}

                <AppShell.Main bg={colors.gray[0]}>
                    <Outlet />
                </AppShell.Main>

                <AppShell.Footer
                  style={{ boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.15)' }}
                >
                    <Flex align={'center'} justify={'center'} p={6}>
                        <Text size={'sm'} c={colors.gray[8]}>
                            &copy; recipes.inc whatever
                        </Text>
                    </Flex>

                </AppShell.Footer>
            </AppShell>
        </AuthContext.Provider>
    );
};

export { Page };
