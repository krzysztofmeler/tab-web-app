import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';

const AdministrativeFunctionsPage: FC = () => {
    const { data: authData } = useAuthContextRedirect();

    if (authData === null) {
        return <>You must login first</>;
    }

    return (
        <>
            <h2>Administrative functions</h2>

            <Link to="/administration/tags">Tags</Link>
        </>
    );
};

export { AdministrativeFunctionsPage };
