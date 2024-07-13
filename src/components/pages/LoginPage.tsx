import { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { Button, Card, Space, Text, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { jsSubmit } from '../../utils/js-submit';
import { AuthContext } from '../../AuthContextType';
import { AuthorizationHeaderFromEmailAndPassword } from '../../utils/auth';
import { fetch } from '../../hooks/useRequest.hook';

const LoginPage: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { update: setAuthData } = useContext(AuthContext);

  const navigate = useNavigate();

  const [disableForm, setDisableForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    if (loading) {
      return;
    }

    setDisableForm(true);
    setLoading(true);

    try {
      // native fetch is used because axios does not allow disabling of redirect following
      const response = await fetch.get('../user', {
        fetchOptions: {
          mode: 'cors',
        },
        headers: {
          Authorization: AuthorizationHeaderFromEmailAndPassword(email, password),
        },
      });

      setLoading(false);

      console.log(response);

      if (response.headers['content-type'] === 'text/html;charset=UTF-8') {
        notifications.show({
          title: 'Invalid credentials',
          message: '',
          autoClose: 3000,
          color: 'red',
        });

        setDisableForm(false);
      } else if (response.status === 200 && response.headers['content-type'] === 'application/json') {
        notifications.show({
          title: 'Logged in',
          message: '',
          autoClose: 3000,
          color: 'green',
        });

        setAuthData({
          password,
          email,
          roles: response.data.roles,
          Authorization: AuthorizationHeaderFromEmailAndPassword(email, password),
        });

        setTimeout(() => {
          navigate('/my-profile');
        }, 500);
      } else {
        throw new Error();
      }
    } catch (error) {
      notifications.show({
        title: 'Failed',
        message: 'Exception, unknown error occurred.',
        autoClose: 3000,
        color: 'red',
      });

      setDisableForm(false);
      setLoading(false);
    }
  };

  return (
    <Card style={{ boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.15)' }} maw={600} mx="auto" my={50} p={30}>
      <Text component="h2" size="xl">
        Login
      </Text>

      <Space h={20} />

      <TextInput disabled={disableForm} value={email} onChange={(e) => setEmail(e.target.value)} label="E-mail" />

      <Space h={10} />

      <TextInput
        disabled={disableForm}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Password"
      />

      <Space h={20} />

      <Button loading={loading} disabled={disableForm} type="button" onClick={jsSubmit(signIn)}>
        Sign in
      </Button>

      <Space h={20} />
      <Text mx="auto" c="gray">
        or
      </Text>
      <Space h={20} />
      <Button variant="light" component={Link} to="/sign-up">
        Create new account
      </Button>
    </Card>
  );
};

export { LoginPage };
