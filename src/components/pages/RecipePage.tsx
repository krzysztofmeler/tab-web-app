import { FC, useState } from 'react';
import { useParams } from 'react-router';
import {
  Button,
  Card,
  Center,
  Flex,
  List,
  ListItem,
  Loader,
  Rating as RatingIndicator,
  Space,
  Text,
  TextInput,
} from '@mantine/core';
import { AxiosResponse } from 'axios';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';
import { useAsyncEffect } from '../../hooks/useAsyncEffect.hook';
import { fetch } from '../../hooks/useRequest.hook';
import { Comment, Rating, Recipe } from '../../types/Recipe';
import { jsSubmit } from '../../utils/js-submit';
import { AddRatingToRecipeRequestData } from '../../types/backend-api/AddRatingToRecipeRequestData';
import { showNotification } from '@mantine/notifications';

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
    const ratingResponse = await fetch.get(`rating/search/?recipeId=${id}`, {
      headers: { Authorization: authData.Authorization },
    });
    const commentsResponse = await fetch.get(`comment/search/?recipeId=${id}`, {
      headers: { Authorization: authData.Authorization },
    });

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
        (commentsResponse.data as unknown as Comment[]).map((comment) => ({
          id: comment.id,
          date: comment.date,
          comment: comment.comment,
          creator: comment.user.email,
        })),
      );
    }
  }, []);

  const avgScore = ratings.map((r) => r.rating).reduce((all, curr) => all + curr, 0) / ratings.length;

  const [comment, setComment] = useState('');

  const [commentFormDisabled, setCommentFormDisabled] = useState(false);

  const addComment = async () => {
    setCommentFormDisabled(true);
    const response = await fetch.post(
      'comment/new',
      {
        comment,
        recipeId: Number.parseInt(id, 10),
      },
      { headers: { Authorization: authData.Authorization } },
    );


    if (response.status === 200) {
      const commentsResponse = await fetch.get(`comment/search/?recipeId=${id}`, {
        headers: { Authorization: authData.Authorization },
      });

      setCommentFormDisabled(false);

      if (commentsResponse.status === 200) {
        setComment('');
        setComments(
          (commentsResponse.data as unknown as Comment[]).map((comment) => ({
            id: comment.id,
            date: comment.date,
            comment: comment.comment,
            creator: comment.user.email,
          })),
        );
      } else {
        showNotification({
          title: 'Error',
          message: 'Comment was created but an error occurred during comment list update',
          color: 'red',
        })
      }
    } else {
      setCommentFormDisabled(false);
      showNotification({
        title: 'Error',
        message: 'Comment was not created',
        color: 'red',
      })
    }
  };

  if (recipe === null) {
    return (
      <Center my={100}>
        <Loader />
      </Center>
    );
  }

  const addRating = async (value: number) => {
    const response = await fetch.post<unknown, AxiosResponse, AddRatingToRecipeRequestData>(
      'rating/new',
      { recipeId: Number.parseInt(id, 10), rating: value },
      { headers: { Authorization: authData.Authorization } },
    );

    if (response.status === 200) {
      setRatings([
        ...ratings,
        {
          date: new Date().toISOString(),
          id: 1,
          creator: authData.email,
          rating: value,
        },
      ]);
    }
  };

  const ratingEnabled = ratings.find((r) => r.creator === authData.email) === undefined;

  return (
    <Flex maw={1200} mx="auto" my={50} direction="column" gap={20}>
      <Text component="h2">Recipe</Text>

      <Card style={{ boxShadow: '0 0 5px 0 #bbb' }} p={30}>
        <Text size="xs" c="#999">
          Category: {recipe.categories[0]}
        </Text>
        <Text size="xl">{recipe.name}</Text>
        <Space h={5} />

        <Flex align="center" gap={10}>
          {Number.isNaN(avgScore) && <RatingIndicator readOnly={!ratingEnabled} onChange={addRating} c="#eee" />}
          {!Number.isNaN(avgScore) && (
            <RatingIndicator readOnly={!ratingEnabled} onChange={addRating} value={avgScore} fractions={ratingEnabled ? 1 : 10} />
          )}

          <Text size="xs" c="#999">
            {avgScore ? `${avgScore} from (${ratings.length}) ratings` : 'no ratings yet'}
          </Text>
        </Flex>
        <Space h={10} />
        <Text size="sm" c="#333">
          {recipe.description}
        </Text>

        <Space h={20} />

        <Text c="#222">Steps:</Text>
        <List type="ordered">
          {recipe.steps.map((step) => (
            <ListItem c="#333">{step}</ListItem>
          ))}
        </List>
      </Card>

      <Text component="h2">Comments</Text>

      <Flex direction="column" gap={10}>
        {comments.length === 0 && (
          <Card style={{ boxShadow: '0 0 5px 0 #bbb' }} p={30}>
            <Center>
              <Text c="#333">No comments yet</Text>
            </Center>
          </Card>
        )}

        {comments.map((comment) => (
          <Card key={comment.id} style={{ boxShadow: '0 0 5px 0 #bbb' }} p={30}>
            <Flex justify="space-between">
              <Text size="xs" c="#222">
                {comment.creator}
              </Text>
              <Text size="xs" c="#555">
                {new Date(comment.date).toLocaleString()}
              </Text>
            </Flex>
            <Text>{comment.comment}</Text>
          </Card>
        ))}

        <Flex w="100%" gap={10}>
          <TextInput disabled={commentFormDisabled} w="calc(100% - 150px)" value={comment} onChange={(e) => setComment(e.target.value)} />
          <Button w="140px" onClick={addComment} disabled={commentFormDisabled} loading={commentFormDisabled}>
            Add comment
          </Button>
        </Flex>
      </Flex>

      <Text component="h2">Ratings</Text>

      <Flex direction="column" gap={10}>
        {ratings.length === 0 && (
          <Card style={{ boxShadow: '0 0 5px 0 #bbb' }} p={30}>
            <Center>
              <Text c="#333">No ratings yet</Text>
            </Center>
          </Card>
        )}

        {ratings.length > 0 && (
          <Card style={{ boxShadow: '0 0 5px 0 #bbb' }} p={30}>
            <Flex direction="column" align="center" gap={10}>
              {ratings.map((rating) => (
                <Flex gap={15} align="center">
                  <RatingIndicator readOnly value={rating.rating} />
                  <Text size="sm" c="#333">
                    {rating.creator}
                  </Text>
                  <Text size="xs" c="#999">
                    {rating.date}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Card>
        )}
      </Flex>
    </Flex>
  );
};

export { RecipePage };
