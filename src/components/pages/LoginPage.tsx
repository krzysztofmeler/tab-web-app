import { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { TextInput } from '../forms/TextInput';
import { jsSubmit } from '../../utils/js-submit';
import { AuthContext } from '../../AuthContextType';
import settings from "../../settings";

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

        const authString = btoa(email + ':' + password);

        try {
            // native fetch is used because axios does not allow disabling of redirect following
            const response = await fetch(settings.backendURI + '../user', {
                method: 'GET',
                mode: "cors",
                redirect: "manual",
                headers: {
                    Authorization: `Basic ${authString}`
                }
            })

            if (response.status === 200) {

                const data = await response.json();

                setAuthData({ password, email, roles: data.roles }); // todo: valid rules from response
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
        <>
            <h2>Login</h2>

            <TextInput value={email} updateValue={setEmail} label="E-mail" />
            <TextInput
              value={password}
              updateValue={setPassword}
              label="Password"
            />

            { invalidCredentials && <p>Invalid credentials provided</p> }

            <button
              disabled={processing}
              type="button"
              onClick={jsSubmit(signIn)}
            >
                Sign in
            </button>

            <p>or</p>
            <Link to="/sign-up">Create new account</Link>
        </>
    );
};

export { LoginPage };
