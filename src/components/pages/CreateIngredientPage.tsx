import { FC } from 'react';
import {Button, Card, Flex, Text, TextInput} from '@mantine/core';
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAuthContextRedirect} from "../../hooks/useAuthContextRedirect.hook";
import { fetch } from '../../hooks/useRequest.hook';

type FormType = {
  ingredient: string;
}

const CreateIngredientPage: FC = () => {

  const validationSchema = z.object({
    ingredient: z.string().min(2, "Minimal length is 2 characters.").max(50, "Maximal length is 50 characters")
  });

  const { register, formState: { errors }, handleSubmit } = useForm<FormType>({
    resolver: zodResolver(validationSchema),
    mode: 'onTouched'
  })

  const { data: authData } = useAuthContextRedirect();

  if (!authData) {
    return (<>Login first</>);
  }

  const handleSubmitOK = async (data: FormType) => {
      const response = await fetch('ingredient/new', {
        data,
        method: 'POST',
        headers: { Authorization: authData.Authorization },
      });

      if (response.status === 200) {
        // todo: handle
      } else {
        // todo: handle
      }
  }

  const handleSubmitError = () => {
    // todo: show notification
  }


    return (
        <Flex
          maw={800}
          gap={20}
          mx="auto"
          my={50}
          direction="column"
          justify="stretch"
        >
            <Flex justify="space-between">
                <Text component="h2" size="xl">
                    Create ingredient
                </Text>
            </Flex>

              <Card
                style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.15)' }}
              >
                  <Flex direction={'column'} gap={20} justify={'start'}>
                      <TextInput maw={400} {...register('ingredient')} label={'Ingredient name'} error={errors.ingredient?.message} />

                    <Button maw={100} onClick={handleSubmit(handleSubmitOK, handleSubmitError)}>
                      Create
                    </Button>
                  </Flex>
              </Card>
        </Flex>
    );
};

export { CreateIngredientPage };
