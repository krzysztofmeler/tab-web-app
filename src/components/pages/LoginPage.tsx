import { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { jsSubmit } from '../../utils/js-submit';
import { AuthContext } from '../../AuthContextType';
import settings from '../../settings';
import { AuthorizationHeaderFromEmailAndPassword } from '../../utils/auth';
import {Button, Card, Space, Text, TextInput} from "@mantine/core";

const LoginPage: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const [success, setSuccess] = useState(false);
    const [invalidCredentials, setInvalidCredentials] = useState(false);

    const { update: setAuthData } = useContext(AuthContext);

    const navigate = useNavigate();

    const signIn = async () => {
        if (processing) {
            return;
        }

        setProcessing(true);
        setInvalidCredentials(false);

        try {
            // native fetch is used because axios does not allow disabling of redirect following
            const response = await fetch(`${settings.backendURI}../user`, {
                method: 'GET',
                mode: 'cors',
                redirect: 'manual',
                headers: {
                    Authorization: AuthorizationHeaderFromEmailAndPassword(
                        email,
                        password,
                    ),
                },
            });

            if (response.status === 200) {
                const data = await response.json();

                setAuthData({
                    password,
                    email,
                    roles: data.roles,
                    Authorization: AuthorizationHeaderFromEmailAndPassword(
                        email,
                        password,
                    ),
                }); // todo: valid rules from response
                setSuccess(true);
            } else if (response.status === 302) {
                // 302 means invalid credentials
                setInvalidCredentials(true);
            }
        } catch (error) {
            console.error(error);
            setError(error);
        }

        setProcessing(false);
    };

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                navigate('/my-profile');
            }, 500);
        }
    }, [success]);

    return (
        <Card
          style={{ boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.15)' }}
          maw={600}
          mx={'auto'}
          my={50}
          p={30}

        >

            <Text component={'h2'} size={'xl'}>Login</Text>

            <Space h={20}/>

            <TextInput value={email} onChange={e => setEmail(e.target.value)} label="E-mail" />

            <Space h={10} />

            <TextInput
              value={password}
              onChange={e => setPassword(e.target.value)}
              label="Password"
            />

            {invalidCredentials && <p>Invalid credentials provided</p>}

            <Space h={20} />


            <Button
              disabled={processing}
              type="button"
              onClick={jsSubmit(signIn)}
            >
                Sign in
            </Button>

            <Space h={20} />
            <Text mx={'auto'} c={'gray'}>or</Text>
            <Space h={20} />
            <Button variant={'light'} component={Link} to={'/sign-up'}>Create new account</Button>
        </Card>
    );
};

export { LoginPage };
