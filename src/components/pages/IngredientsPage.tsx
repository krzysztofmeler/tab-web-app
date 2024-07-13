import { FC, useState } from 'react';
import { Button, Card, Flex, Group, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { fetch } from '../../hooks/useRequest.hook';
import { useAsyncEffect } from '../../hooks/useAsyncEffect.hook';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';
import { Ingredient } from '../../types/Ingredient';
import { notifications } from '@mantine/notifications';

const IngredientsPage: FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const { data: authData } = useAuthContextRedirect();

  if (authData === null) {
    return <>You must login first</>;
  }

  useAsyncEffect(async () => {
    const response = await fetch('ingredient/all', {
      method: 'GET',
      headers: { Authorization: authData.Authorization },
    });

    if (response.status === 200) {
      setIngredients(response.data as Ingredient[]);
    }
  }, []);

  const deleteIngredient = async (id: number) => {
    const response = await fetch.delete(`/ingredient/${id}`, {
      headers: { Authorization: authData.Authorization },
    });

    switch (response.status) {
      case 204:
      {
        notifications.show({
          title: 'Success',
          message: 'Ingredient was deleted.',
          autoClose: 3000,
          color: 'green',
        });

        setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
      }
        break;
      case 500:
      {
        notifications.show({
          title: 'Failed',
          message: 'Ingredient cannot be deleted because it is used within recipe(s).',
          autoClose: 3000,
          color: 'orange',
        });
      }
        break;
      default: {
        notifications.show({
          title: 'Failed',
          message: 'Unknown error occurred.',
          autoClose: 3000,
          color: 'red',
        });
      }
    }
  };

  return (
    <Flex maw={800} gap={20} mx="auto" my={50} direction="column" justify="stretch">
      <Flex justify="space-between">
        <Text component="h2" size="xl">
          Ingredients
        </Text>

        <Button component={Link} to="/administration/create-ingredient">
          Create ingredient
        </Button>
      </Flex>

      <Flex direction="column" gap={15}>
        {ingredients.length === 0 && (
          <Card style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.15)' }}>
            <Flex h={100} justify="center" align="center">
              <Text>No ingredients yet</Text>
            </Flex>
          </Card>
        )}

        {ingredients.map((ingredient) => (
          <Card key={ingredient.id} style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.15)' }}>
            <Flex justify="space-between" align="center">
              <Text>{ingredient.ingredient}</Text>

              <Group gap={15}>
                <Button variant="light" onClick={() => deleteIngredient(ingredient.id)}>
                  Delete
                </Button>
                <Button component={Link} to={`/administration/edit-ingredient/${ingredient.id}`}>
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

export { IngredientsPage };
