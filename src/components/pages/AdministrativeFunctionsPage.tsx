import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';
import {Button, Card, Flex, Group, Space, Text} from "@mantine/core";

const AdministrativeFunctionsPage: FC = () => {
    const { data: authData } = useAuthContextRedirect();

    if (authData === null) {
        return <>You must login first</>;
    }

    return (
        <Flex maw={900} mx={'auto'} py={50} direction={'column'} gap={20}>
            <Text component={'h2'}>Administrative functions</Text>

            <Card                   style={{ boxShadow: '0 0 30px 0 rgba(0, 0, 0, 0.15)' }}>
              <Button maw={200} component={Link} to={'/administration/tags'}>Tags</Button>
              <Space h={20} />
              <Button maw={200} component={Link} to={'/administration/units'}>Units</Button>
              <Space h={20} />
              <Button maw={200} component={Link} to={'/administration/ingredients'}>Ingredients</Button>

            </Card>
        </Flex>
    );
};

export { AdministrativeFunctionsPage };
