import { FC } from 'react';
import { Link } from 'react-router-dom';

const MyProfilePage: FC = () => (
    <>
        My Profile Page <Link to="/add-recipe">Create recipe</Link>{' '}
    </>
);

export { MyProfilePage };
