import { FC, useState } from 'react';
import { Button, Card, Flex, Text, TextInput } from '@mantine/core';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';
import { fetch } from '../../hooks/useRequest.hook';

type FormType = {
  ingredient: string;
};

const CreateIngredientPage: FC = () => {
  const validationSchema = z.object({
    ingredient: z.string().min(2, 'Minimal length is 2 characters.').max(50, 'Maximal length is 50 characters'),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormType>({
    resolver: zodResolver(validationSchema),
    mode: 'onTouched',
  });

  const { data: authData } = useAuthContextRedirect();

  if (!authData) {
    return <>Login first</>;
  }

  const [disableForm, setDisableForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmitOK = async (data: FormType) => {
    setDisableForm(true);
    setLoading(true);
    const response = await fetch('ingredient/new', {
      data,
      method: 'POST',
      headers: { Authorization: authData.Authorization },
    });

    setLoading(false);

    if (response.status === 200) {
      notifications.show({
        title: 'Success',
        message: 'Ingredient was created.',
        autoClose: 3000,
        color: 'green',
      });

      setTimeout(() => {
        navigate('/administration/ingredients');
      }, 800);
    } else {
      notifications.show({
        title: 'Failed',
        message: 'Unknown error occurred.',
        autoClose: 3000,
        color: 'red',
      });

      setDisableForm(false);
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
          Create ingredient
        </Text>
      </Flex>

      <Card style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.15)' }}>
        <Flex direction="column" gap={20} justify="start">
          <TextInput
            disabled={disableForm}
            maw={400}
            {...register('ingredient')}
            label="Ingredient name"
            error={errors.ingredient?.message}
          />

          <Button
            loading={loading}
            disabled={disableForm}
            maw={100}
            onClick={handleSubmit(handleSubmitOK, handleSubmitError)}
          >
            Create
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
};

export { CreateIngredientPage };
