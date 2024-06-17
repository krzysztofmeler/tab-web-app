import { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import {
    Button,
    Card,
    FormGroup,
    H2,
    Icon,
    InputGroup,
} from '@blueprintjs/core';
import { jsSubmit } from '../../utils/js-submit';
import { AuthContext } from '../../AuthContextType';
import settings from '../../settings';
import { AuthorizationHeaderFromEmailAndPassword } from '../../utils/auth';

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
                redirect: 'error',
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
        <div className="middle spaced">
            <Card>
                <H2>Login</H2>

                <FormGroup>
                    <InputGroup
                      aria-label="E-mail"
                      value={email}
                      onValueChange={setEmail}
                      leftElement={<Icon icon="user" />}
                    />
                </FormGroup>
                <FormGroup>
                    <InputGroup
                      value={password}
                      aria-label="Password"
                      onValueChange={setPassword}
                      leftIcon="projects"
                      rightElement={
                            <Button onClick={() => {}} icon="eye-open" />
                        }
                    />
                </FormGroup>

                <Button
                  aria-label="Log in"
                  icon="log-in"
                  onClick={jsSubmit(signIn)}
                >
                    Sign in
                </Button>

                <p>or</p>

                <Link to="/sign-up">
                    <Button icon="new-person">Create new account</Button>
                </Link>
            </Card>
        </div>
    );
};

export { LoginPage };
