import { FC, useState } from 'react';
import { useParams } from 'react-router';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';
import { useAsyncEffect } from '../../hooks/useAsyncEffect.hook';
import { fetch } from '../../hooks/useRequest.hook';
import { Rating, Recipe } from '../../types/Recipe';

type RatingDisplay = {
    rating: number;
    creator: string;
    date: string;
    id: number;
};

const RecipePage: FC = () => {
    const { data: authData } = useAuthContextRedirect();

    if (authData === null) {
        return <>You must login first</>;
    }

    const { id } = useParams() as { id: string };

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [ratings, setRatings] = useState<RatingDisplay[]>([]);

    useAsyncEffect(async () => {
        const recipeResponse = await fetch.get(`recipe/${id}`, {
            headers: { Authorization: authData.Authorization },
        });
        const ratingResponse = await fetch.get(
            `rating/search/?recipeId=${id}`,
            { headers: { Authorization: authData.Authorization } },
        );

        if (recipeResponse.status === 200) {
            setRecipe(recipeResponse.data);
        }

        if (ratingResponse.status === 200) {
            setRatings(
                (ratingResponse.data as unknown as Rating[]).map(
                    (rating): RatingDisplay => ({
                        rating: rating.rating,
                        creator: rating.user.email,
                        date: new Date(rating.date).toLocaleString(),
                        id: rating.id,
                    }),
                ),
            );
        }
    }, []);

    const avgScore =
        ratings.map((r) => r.rating).reduce((all, curr) => all + curr, 0) /
        ratings.length;

    if (recipe === null) {
        return <>Loading recipe...</>;
    }

    return (
        <>
            <h2>Recipe</h2>

            <p>{recipe.name}</p>
            <p>Score: {avgScore}</p>
            <p>{recipe.description}</p>
            {recipe.categories.map((c) => (
                <p key={c}>Category: {c}</p>
            ))}

            <p>Steps:</p>
            <ol>
                {recipe.steps.map((step) => (
                    <li key={step}>{step}</li>
                ))}
            </ol>

            <p>Rating:</p>
            <ul>
                {ratings.map((r) => (
                    <li key={r.id}>
                        {r.rating.toString()} by {r.creator} as {r.date}
                    </li>
                ))}
            </ul>
        </>
    );
};

export { RecipePage };
