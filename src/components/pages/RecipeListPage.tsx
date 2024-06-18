import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAsyncEffect } from '../../hooks/useAsyncEffect.hook';
import { fetch } from '../../hooks/useRequest.hook';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';
import { Recipe } from '../../types/Recipe';
import {Card, H2, UL} from "@blueprintjs/core";

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

            <div className={'middle spaced'}>
                <H2>Recipe list</H2>

                {recipes.map((recipe) => (

                    <Link
                      key={recipe.id}
                      to={`/recipe/${recipe.id}/${encodeURIComponent(
                            recipe.name,
                        )}`}
                    >

                        <div className={'spaced middle'}>
                        <Card>
                        <p className={'bp5-text-large'}>{recipe.name}</p>
                        <p>
                            {recipe.description.slice(0, 120)}
                            {recipe.description.length > 120 ? '...' : ''}
                        </p>
                        </Card>
                        </div>
                    </Link>

                ))}
            </div>
    );
};

export { RecipeListPage };
