import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
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

    return (
        <>
            <h2>Recipe list</h2>

            <ul>
                {recipes.map((recipe) => (
                    <Link
                      key={recipe.id}
                      to={`/recipe/${recipe.id}/${encodeURIComponent(
                            recipe.name,
                        )}`}
                    >
                        <p>{recipe.name}</p>
                        <p>
                            {recipe.description.slice(0, 120)}
                            {recipe.description.length > 120 ? '...' : ''}
                        </p>
                    </Link>
                ))}
            </ul>
        </>
    );
};

export { RecipeListPage };
