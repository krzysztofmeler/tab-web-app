import { FC, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { TextInput } from '../forms/TextInput';
import { jsSubmit } from '../../utils/js-submit';
import { fetch } from '../../hooks/useRequest.hook';
import { AuthContext, Role } from '../../AuthContextType';

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
                setAuthData({ password, email, roles: response.data.roles });
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
        <>
            Sign Up page
            <TextInput value={email} updateValue={setEmail} label="E-mail" />
            <TextInput
              value={password}
              updateValue={setPassword}
              label="Password"
            />
            <button type="button" onClick={jsSubmit(signUp)}>
                Sign up
            </button>
        </>
    );
};

export { SignUpPage };
