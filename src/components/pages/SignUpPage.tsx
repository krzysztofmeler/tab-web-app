import { FC, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { jsSubmit } from '../../utils/js-submit';
import { fetch } from '../../hooks/useRequest.hook';
import { AuthContext, Role } from '../../AuthContextType';
import { AuthorizationHeaderFromEmailAndPassword } from '../../utils/auth';
import {Button, Card, Checkbox, Space, Text, TextInput} from "@mantine/core";
import {Link} from "react-router-dom";

const SignUpPage: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const [success, setSuccess] = useState(false);

    const { update: setAuthData } = useContext(AuthContext);

    const signUp = async () => {
        setProcessing(true);

        try {
            const response = await fetch.post('register', {
                email,
                password,
                roles: [Role.USER, Role.ADMIN],
            });

            if (response.status === 200) {
                setAuthData({
                    password,
                    email,
                    roles: response.data.roles,
                    Authorization: AuthorizationHeaderFromEmailAndPassword(
                        email,
                        password,
                    ),
                });
                setSuccess(true);
            }
        } catch (error) {
            console.error(error);
            setError(error);
        }

        setProcessing(false);
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                navigate('/my-profile');
            }, 1000);
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

          <Text component={'h2'} size={'xl'}>Sign up</Text>

          <Space h={20}/>

          <TextInput value={email} onChange={e => setEmail(e.target.value)} label="E-mail" />

          <Space h={10} />

          <TextInput
            value={password}
            onChange={e => setPassword(e.target.value)}
            label="Password"
          />

          <Space h={20} />

          <Checkbox label={'I accept terms and conditions of services'} />

          <Space h={20} />


          <Button
            disabled={processing}
            type="button"
            onClick={jsSubmit(signUp)}
          >
              Create account
          </Button>

          <Space h={20} />
          <Text mx={'auto'} c={'gray'}>or</Text>
          <Space h={20} />
          <Button variant={'light'} component={Link} to={'/sign-in'}>Sign in with existing account</Button>
      </Card>
    );
};

export { SignUpPage };
