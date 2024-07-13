import { FC, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Card, Checkbox, Space, Text, TextInput } from '@mantine/core';
import { Link } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { jsSubmit } from '../../utils/js-submit';
import { fetch } from '../../hooks/useRequest.hook';
import { AuthContext, Role } from '../../AuthContextType';
import { AuthorizationHeaderFromEmailAndPassword } from '../../utils/auth';

const SignUpPage: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [disableForm, setDisableForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);

  const { update: setAuthData } = useContext(AuthContext);

  const navigate = useNavigate();

  const signUp = async () => {
    if (!termsAccepted) {
      notifications.show({
        title: 'Terms must be accepted',
        message: '',
        autoClose: 4000,
        color: 'red',
      });

      return;
    }

    setDisableForm(true);
    setLoading(true);

    try {
      const response = await fetch.post('register', {
        email,
        password,
        roles: [Role.USER, Role.ADMIN],
      });

      setLoading(false);

      if (response.status === 200) {
        setAuthData({
          password,
          email,
          roles: response.data.roles,
          Authorization: AuthorizationHeaderFromEmailAndPassword(email, password),
        });

        notifications.show({
          title: 'Success',
          message: 'Account created, logging in.',
          autoClose: 3000,
          color: 'green',
        });

        setTimeout(() => {
          navigate('/my-profile');
        }, 1000);
      } else if (response.status === 400) {
        notifications.show({
          title: 'Invalid data or e-mail not available',
          message: '',
          autoClose: 4000,
          color: 'red',
        });
        setDisableForm(false);
      }
    } catch (error) {
      setDisableForm(false);
    }

    setLoading(false);
  };

  return (
    <Card style={{ boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.15)' }} maw={600} mx="auto" my={50} p={30}>
      <Text component="h2" size="xl">
        Sign up
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

      <Checkbox
        disabled={disableForm}
        value={`${termsAccepted}`}
        onChange={(e) => setTermsAccepted(e.target.checked)}
        label="I accept terms and conditions of services"
      />

      <Space h={20} />

      <Button loading={loading} disabled={disableForm} type="button" onClick={jsSubmit(signUp)}>
        Create account
      </Button>

      <Space h={20} />
      <Text mx="auto" c="gray">
        or
      </Text>
      <Space h={20} />
      <Button variant="light" component={Link} to="/sign-in">
        Sign in with existing account
      </Button>
    </Card>
  );
};

export { SignUpPage };
