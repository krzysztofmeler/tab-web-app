import { FC, useEffect, useState } from 'react';
import { TextInput } from '../forms/TextInput';
import { jsSubmit } from '../../utils/js-submit';
import { fetch } from '../../hooks/useRequest.hook';
import {useNavigate} from "react-router";

const SignUpPage: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const [success, setSuccess] = useState(false);

    const signUp = async () => {
        setProcessing(true);

        try {
            const response = await fetch.post('register', {
                email,
                password,
                roles: ['USER'],
            });

            if (response.status === 200) {
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
          navigate('/my-profile')
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
              label="E-mail"
            />
            <button type="button" onClick={jsSubmit(signUp)}>
                Sign up
            </button>
        </>
    );
};

export { SignUpPage };
