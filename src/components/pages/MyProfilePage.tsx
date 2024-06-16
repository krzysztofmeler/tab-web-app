import { FC, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { AuthContext, Role } from '../../AuthContextType';
import { useEffectOnce } from '../../hooks/useEffectOnce.hook';

const MyProfilePage: FC = () => {
    const { data: authData } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffectOnce(() => {
        if (authData === null) {
            navigate('/sign-in');
        }
    });

    if (authData === null) {
        return <>You have to login first.</>;
    }

    return (
        <>
            <p>My Profile Page</p>
            <p>{authData.email}</p>
            <p>roles: </p>
            <ul>
                {authData.roles.map((role) => (
                    <li key={role}>{role}</li>
                ))}
            </ul>
            <Link to="/add-recipe">Create recipe</Link>
            {authData.roles.includes(Role.ADMIN) && (
                <Link to="/administration">Administrative functions</Link>
            )}
        </>
    );
};

export { MyProfilePage };
