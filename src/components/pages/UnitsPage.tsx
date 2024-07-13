import { FC, useState } from 'react';
import { Button, Card, Flex, Group, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { fetch } from '../../hooks/useRequest.hook';
import { useAsyncEffect } from '../../hooks/useAsyncEffect.hook';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';
import { Unit } from '../../types/Unit';

const UnitsPage: FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);

  const { data: authData } = useAuthContextRedirect();

  if (authData === null) {
    return <>You must login first</>;
  }

  useAsyncEffect(async () => {
    const response = await fetch('unit/all', {
      method: 'GET',
      headers: { Authorization: authData.Authorization },
    });

    if (response.status === 200) {
      setUnits(response.data as Unit[]);
    }
  }, []);

  const deleteUnit = (id: number) => {
    // todo: implement
  };

  return (
    <Flex maw={800} gap={20} mx="auto" my={50} direction="column" justify="stretch">
      <Flex justify="space-between">
        <Text component="h2" size="xl">
          Units
        </Text>

        <Button component={Link} to="/administration/create-unit">
          Create unit
        </Button>
      </Flex>

      <Flex direction="column" gap={15}>
        {units.length === 0 && (
          <Card style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.15)' }}>
            <Flex h={100} justify="center" align="center">
              <Text>No units yet</Text>
            </Flex>
          </Card>
        )}

        {units.map((unit) => (
          <Card key={unit.id} style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.15)' }}>
            <Flex justify="space-between" align="center">
              <Text>{unit.unit}</Text>

              <Group gap={15}>
                <Button variant="light" onClick={() => deleteUnit(unit.id)}>
                  Delete
                </Button>
                <Button component={Link} to={`/administration/edit-unit/${unit.id}`}>
                  Edit
                </Button>
              </Group>
            </Flex>
          </Card>
        ))}
      </Flex>
    </Flex>
  );
};

export { UnitsPage };
