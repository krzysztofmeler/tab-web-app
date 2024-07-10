import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import {
    Badge,
    Button,
    Card,
    Flex,
    Image,
    Text,
    useMantineTheme,
} from '@mantine/core';
import { Role } from '../../AuthContextType';
import userIcon from '../../assets/user-icon.png';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';

const MyProfilePage: FC = () => {
    const auth = useAuthContextRedirect();

    const { colors } = useMantineTheme();

    const navigate = useNavigate();

    const logout = () => {
        auth.update(null);
        navigate('/');
    };

    if (auth.data === null) {
        return <>You have to login first.</>;
    }

    const isAdmin = auth.data.roles.includes(Role.ADMIN);

    return (
        <Flex direction="column" gap={20} maw={800} mx="auto" my={40}>
            <Flex justify="space-between" align="center">
                <Text component="h2" size="lg">
                    My profile
                </Text>

                <Button onClick={() => logout()}>Logout</Button>
            </Flex>
            <Card
              style={{ boxShadow: '0 0 30px 0 rgba(0, 0, 0, 0.15)' }}
              p={30}
            >
                <Flex gap={20} align="center">
                    <Image width={60} h={60} src={userIcon} />
                    <Text>{auth.data.email}</Text>
                    {isAdmin ? (
                        <Badge bg={colors.red[8]}>ADMIN</Badge>
                    ) : (
                        <Badge>USER</Badge>
                    )}
                </Flex>
            </Card>

            <Flex gap={20}>
                <Button component={Link} to="/create-recipe">
                    Create recipe
                </Button>
            </Flex>

            {isAdmin && (
                <Button
                  maw={300}
                  bg={colors.red[8]}
                  component={Link}
                  to="/administration"
                >
                    Administrative functions
                </Button>
            )}
        </Flex>
    );
};

export { MyProfilePage };
