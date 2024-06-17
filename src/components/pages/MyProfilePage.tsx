import { FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { Button, H2, Icon, Tag, Text } from '@blueprintjs/core';
import { AuthContext, Role } from '../../AuthContextType';
import { useEffectOnce } from '../../hooks/useEffectOnce.hook';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';
import { jsSubmit } from '../../utils/js-submit';

const MyProfilePage: FC = () => {
    const { data: authData, update: updateAuthData } = useAuthContextRedirect();

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
        <div className="middle spaced">
            <div className="flex-between">
                <H2>My profile</H2>
                <Button
                  className="bp5-outlined"
                  icon="log-out"
                  onClick={jsSubmit(() => updateAuthData(null))}
                >
                    Log out
                </Button>
            </div>

            <div className="flex">
                <Icon icon="user" size={50} />
                <Text style={{ margin: '20px' }}>{authData.email}</Text>
                {authData.roles.map((role) => (
                    <Tag key={role}>{role}</Tag>
                ))}
            </div>

            <Button
              className="bp5-outlined"
              icon="add"
              onClick={() => navigate('/add-recipe')}
            >
                Add new recipe
            </Button>

            {authData.roles.includes(Role.ADMIN) && (
                <Button
                  className="bp5-intent-warning"
                  onClick={() => navigate('/administration')}
                >
                    Administrative functions
                </Button>
            )}
        </div>
    );
};

export { MyProfilePage };
