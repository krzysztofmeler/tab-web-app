import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Card,
    Flex,
    MultiSelect,
    Pagination,
    Select,
    Space,
    Text,
    TextInput,
} from '@mantine/core';
import { useAsyncEffect } from '../../hooks/useAsyncEffect.hook';
import { fetch } from '../../hooks/useRequest.hook';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';
import { Recipe } from '../../types/Recipe';

const RecipeListPage: FC = () => {
    const { data: authData } = useAuthContextRedirect();

    if (authData === null) return <>You must login first</>;

    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useAsyncEffect(async () => {
        const response = await fetch.get('recipe/all', {
            headers: { Authorization: authData.Authorization },
        });

        if (response.status === 200) {
            setRecipes(response.data);
        }
    }, []);

    const [searchString, setSearchString] = useState('');

    const categories = new Set<string>();

    recipes.forEach((recipe) => {
        categories.add(recipe.categories[0]);
    });

    const categories2 = [...categories];

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const filteredRecipes = recipes.filter((recipe) => {
        if (searchString.length && recipe.name.indexOf(searchString) === -1) {
            return false;
        }

        if (selectedCategories.length) {
            return selectedCategories.includes(recipe.categories[0]);
        } else {
            return true;
        }
    });

    const pageSize = 5;
    const [page, setPage] = useState(1);
    const pageCount = Math.ceil(filteredRecipes.length / pageSize);

    const recipesPage = filteredRecipes.slice(
        (page - 1) * pageSize,
        page * pageSize,
    );

    return (
        <Flex maw={1200} my={50} mx="auto" gap={20} direction="column">
            <Text component="h2">Recipe list</Text>

            <Flex>
                <TextInput
                  label="Search"
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                />
                <Space w={20} />
                <MultiSelect
                  w={340}
                  onChange={setSelectedCategories}
                  label="Categories"
                  multiple
                  data={categories2}
                  value={selectedCategories}
                />
            </Flex>

            {recipesPage.map((recipe) => (
                <Card style={{ boxShadow: '0 0 5px 0 #ddd' }}>
                    <Text size="lg" style={{ textDecoration: '' }}>
                        {recipe.name}
                    </Text>
                    <Text size="xs">{recipe.description}</Text>

                    <Space h={5} />

                    <Text size="xs" c="#666">
                        {recipe.steps.length} step
                        {recipe.steps.length > 1 && 's'} | Category:{' '}
                        {recipe.categories[0]}
                    </Text>

                    <Space h={10} />

                    <Button
                      maw={120}
                      variant="light"
                      component={Link}
                      to={`/recipe/${recipe.id}/${encodeURIComponent(
                            recipe.name,
                        )}`}
                    >
                        Show
                    </Button>
                </Card>
            ))}

            <Pagination total={pageCount} value={page} onChange={setPage} />
        </Flex>
    );
};

export { RecipeListPage };
