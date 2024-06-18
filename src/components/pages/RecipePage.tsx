import { FC, useState } from 'react';
import { useParams } from 'react-router';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';
import { useAsyncEffect } from '../../hooks/useAsyncEffect.hook';
import { fetch } from '../../hooks/useRequest.hook';
import { Comment, Rating, Recipe } from '../../types/Recipe';
import { TextInput } from '../forms/TextInput';
import { jsSubmit } from '../../utils/js-submit';
import {Button, Card, H2, InputGroup} from "@blueprintjs/core";

type RatingDisplay = {
    rating: number;
    creator: string;
    date: string;
    id: number;
};

type CommentDisplay = {
    comment: string;
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
    const [comments, setComments] = useState<CommentDisplay[]>([]);

    useAsyncEffect(async () => {
        const recipeResponse = await fetch.get(`recipe/${id}`, {
            headers: { Authorization: authData.Authorization },
        });
        const ratingResponse = await fetch.get(
            `rating/search/?recipeId=${id}`,
            { headers: { Authorization: authData.Authorization } },
        );
        const commentsResponse = await fetch.get(
            `comment/search/?recipeId=${id}`,
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

        if (commentsResponse.status === 200) {
            setComments(
                (commentsResponse.data as unknown as Comment[]).map(
                    (comment) => ({
                        id: comment.id,
                        date: comment.date,
                        comment: comment.comment,
                        creator: comment.user.email,
                    }),
                ),
            );
        }
    }, []);

    const avgScore =
        ratings.map((r) => r.rating).reduce((all, curr) => all + curr, 0) /
        ratings.length;

    const [comment, setComment] = useState('');

    const addComment = async () => {
        const response = await fetch.post('comment/new', {
            comment,
            recipeId: id,
        });

        if (response.status === 200) {

          setComment("");

          const addedCommentData = response.data as Comment;

          const newCommentDisplayData: CommentDisplay = {
            id: addedCommentData.id,
            comment: addedCommentData.comment,
            date: new Date().toISOString(),
            creator: authData.email,
          }

          setComments([...comments, newCommentDisplayData])
        }
    };

    if (recipe === null) {
        return <>Loading recipe...</>;
    }

    return (
        <div className={'middle spaced'}>
            <H2>Recipe</H2>

          <Card>


            <p className={'bp5-text-large'}>{recipe.name}</p>
            { ratings.length && <p>Score: {avgScore}</p> }
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

            { ratings.length && <>
                <p>Rating:</p>
                <ul>
                  {ratings.map((r) => (
                    <li key={r.id}>
                      {r.rating.toString()} by {r.creator} as {r.date}
                    </li>
                  ))}
                </ul>
            </> }

            { ratings.length === 0 && <p>No reviews yet.</p> }



            { comments.length && <>
              <p>Comments:</p>
              <ul>
                  {comments.map((c) => (
                    <li key={c.id}>
                  {c.creator} as {c.date} wrote:
                  <br />
                  {c.comment}
                </li>
                ))}
              </ul>
            </>
            }

            { comments.length === 0 && <p>No comments yet</p> }

            <div className={'flex'}>

            <InputGroup value={comment} onChange={(e) => setComment(e.target.value)} aria-label={'New comment content'} />

            <Button icon={'add'} onClick={jsSubmit(addComment)}>Add comment</Button>
            </div>

          </Card>

        </div>
    );
};

export { RecipePage };
