import { FC, useState } from 'react';
import { Blockquote, Button, Card, Flex, Text, TextInput } from '@mantine/core';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosResponse } from 'axios';
import { useNavigate, useParams } from 'react-router';
import { notifications } from '@mantine/notifications';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';
import { fetch } from '../../hooks/useRequest.hook';
import { useAsyncEffect } from '../../hooks/useAsyncEffect.hook';
import { GetIngredientResponseData } from '../../types/backend-api/GetIngredientResponseData';

type FormType = {
  ingredient: string;
};

const EditIngredientPage: FC = () => {
  const { data: authData } = useAuthContextRedirect();

  if (!authData) {
    return <>Login first</>;
  }

  const { id } = useParams();
  const navigate = useNavigate();

  const validationSchema = z.object({
    ingredient: z.string().min(2, 'Minimal length is 2 characters.').max(50, 'Maximal length is 50 characters'),
  });

  const {
    register,
    formState: { errors, isLoading },
    handleSubmit,
    setValue,
  } = useForm<FormType>({
    resolver: zodResolver(validationSchema),
    mode: 'onTouched',
  });

  useAsyncEffect(async () => {
    const response = await fetch.get<unknown, AxiosResponse<GetIngredientResponseData>>(`ingredient/${id}`, {
      headers: { Authorization: authData.Authorization },
    });

    switch (response.status) {
      case 200:
        {
          setValue('ingredient', response.data.ingredient);
        }
        break;
      case 404:
        {
          notifications.show({
            title: 'Failed',
            message: 'Ingredient not found. Download of ingredient data failed.',
            autoClose: 3000,
            color: 'orange',
          });

          setTimeout(() => {
            navigate('/administration/ingredients');
          }, 500);
        }
        break;
      default: {
        notifications.show({
          title: 'Failed',
          message: 'Unknown error occurred.',
          autoClose: 3000,
          color: 'red',
        });

        setTimeout(() => {
          navigate('/administration/ingredients');
        }, 500);
      }
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);

  const handleSubmitOK = async (data: FormType) => {
    setLoading(true);
    setFormDisabled(true);

    // to modify tag, we need to delete it and create new one
    const response = await fetch.delete(`/ingredient/${id}`, {
      headers: { Authorization: authData.Authorization },
    });

    switch (response.status) {
      case 204:
        {
          const response = await fetch('ingredient/new', {
            data,
            method: 'POST',
            headers: { Authorization: authData.Authorization },
          });

          if (response.status === 200) {
            notifications.show({
              title: 'Success',
              message: 'Ingredient was successfully recreated with new name.',
              autoClose: 3000,
              color: 'green',
            });

            setLoading(false);

            setTimeout(() => {
              navigate('/administration/ingredients');
            }, 800);
          } else {
            notifications.show({
              title: 'Failed',
              message: 'Ingredient was deleted but new one was not created.',
              autoClose: 3000,
              color: 'red',
            });

            setLoading(false);
          }
        }
        break;
      case 500: {
        notifications.show({
          title: 'Failed',
          message: 'Ingredient cannot be modified because it is used within at least one recipe.',
          autoClose: 3000,
          color: 'orange',
        });

        setLoading(false);
      }
    }
  };

  const handleSubmitError = () => {
    notifications.show({
      title: 'Invalid data',
      message: 'Check provided data, fix errors and try again.',
      autoClose: 4000,
      color: 'red',
    });
  };

  return (
    <Flex maw={800} gap={20} mx="auto" my={50} direction="column" justify="stretch">
      <Flex justify="space-between">
        <Text component="h2" size="xl">
          Edit ingredient
        </Text>
      </Flex>

      <Card style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.15)' }}>
        <Flex direction="column" gap={20} justify="start">
          <Blockquote color="orange" p={10}>
            <Flex direction="column" gap={10}>
              <Text size="sm">Important notice</Text>
              <Text size="xs" c="#333">
                Only ingredients that are not used within recipes can be modified.
              </Text>
              <Text size="xs" c="#333">
                Saving of ingredient causes it to be deleted and new one with new name to be created. It will have different
                ID after this operation.
              </Text>
            </Flex>
          </Blockquote>

          <TextInput disabled={formDisabled} maw={400} {...register('ingredient')} label="Ingredient" error={errors.ingredient?.message} />

          <Button
            disabled={formDisabled}
            loading={loading}
            maw={100}
            onClick={handleSubmit(handleSubmitOK, handleSubmitError)}
          >
            Save
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
};

export { EditIngredientPage };
