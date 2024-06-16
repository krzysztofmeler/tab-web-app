import {FC, useContext, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { AuthContext, Role } from '../../AuthContextType';

const MyProfilePage: FC = () => {
    const { data: authData } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (authData === null) {
            navigate('/sign-in');
        }
    }, []);

    if (authData === null) {
        return <>You have to login first.</>;
    }

    return (
        <>
            My Profile Page <Link to="/add-recipe">Create recipe</Link>
            {authData.roles.includes(Role.ADMIN) && (
                <Link to="/administration">Administrative functions</Link>
            )}
        </>
    );
};

export { MyProfilePage };
