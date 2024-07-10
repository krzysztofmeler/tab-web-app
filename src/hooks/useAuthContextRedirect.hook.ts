import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AuthContextType } from '../AuthContextType';
import { useAuthContext } from './useAuthContext.hook';

const useAuthContextRedirect = (): AuthContextType => {
    const { data, update } = useAuthContext();

    const navigate = useNavigate();

    useEffect(() => {
        if (data === null) {
            navigate('/sign-in');
        }
    }, []);

    return { data, update };
};

export { useAuthContextRedirect };
