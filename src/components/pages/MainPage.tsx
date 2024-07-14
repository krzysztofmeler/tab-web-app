import React, { FC, useState } from 'react';
import { Button, Card, Center, Flex, MultiSelect, Pagination, Space, Text, TextInput } from '@mantine/core';
import { Link } from 'react-router-dom';
import { Recipe } from '../../types/Recipe';
import { useAsyncEffect } from '../../hooks/useAsyncEffect.hook';
import { fetch } from '../../hooks/useRequest.hook';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';

const MainPage: FC = () => {

  const { data: authData } = useAuthContextRedirect();

  if (authData === null) return <>You must login first</>;

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState(false);

  useAsyncEffect(async () => {
    const response = await fetch.get('recipe/all', {
      headers: { Authorization: authData.Authorization },
    });

    if (response.status === 200 && response.headers['content-type'] === 'application/json') {
      setRecipes(response.data);
    } else {
      setError(true);
    }
  }, []);


  return (
    <Flex maw={1200} my={50} mx="auto" gap={20} wrap={'wrap'}>
      <Text w={'100%'} component="h2">Recipes</Text>

      { error && (
        <Center w={'100%'} h={200} bg={'#eee'}>
          <Text c={'#222'}>An error occurred during loading of list</Text>
        </Center>
      ) }

      {recipes.slice(0, 5).map((recipe) => (
        <Card w={'calc(50% - 10px)'} style={{ boxShadow: '0 0 5px 0 #ddd' }}>
          <Text size="lg" style={{ textDecoration: '' }}>
            {recipe.name}
          </Text>
          <Text size="xs">{recipe.description}</Text>

          <Space h={5} />

          <Text size="xs" c="#666">
            {recipe.steps.length} step
            {recipe.steps.length > 1 && 's'} | Category: {recipe.categories[0]}
          </Text>

          <Space h={10} />

          <Button
            maw={120}
            variant="light"
            component={Link}
            to={`/recipe/${recipe.id}/${encodeURIComponent(recipe.name)}`}
          >
            Show
          </Button>
        </Card>
      ))}

      <Button component={Link} h={145.4} variant={'light'} to={`/recipes`} w={'calc(50% - 10px)'} style={{ boxShadow: '0 0 5px 0 #ddd' }}>
        <Text size="lg" style={{ textDecoration: '' }}>
          Show all
        </Text>
      </Button>

    </Flex>
  )
};

export { MainPage };
