import { FC } from 'react';
import { Blockquote, Button, Card, Flex, Text, TextInput } from '@mantine/core';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';
import { fetch } from '../../hooks/useRequest.hook';
import { useEffectOnce } from '../../hooks/useEffectOnce.hook';
import { useAsyncEffect } from '../../hooks/useAsyncEffect.hook';
import { AxiosResponse } from 'axios';
import { useParams } from 'react-router';
import { GetTagResponseData } from '../../types/backend-api/GetTagResponseData';

type FormType = {
    tag: string;
};

const EditTagPage: FC = () => {

    const { data: authData } = useAuthContextRedirect();

    if (!authData) {
        return <>Login first</>;
    }

    const { id } = useParams();

    useAsyncEffect(async () => {
        const response  = await fetch.get<unknown, AxiosResponse<GetTagResponseData>>(`tag/${id}`, {
            headers: { Authorization: authData.Authorization },
        });

        if (response.status === 200) {
            setValue('tag', response.data.tag);
        }

        console.log(response.data);
    }, [])

    const validationSchema = z.object({
        tag: z
            .string()
            .min(2, 'Minimal length is 2 characters.')
            .max(20, 'Maximal length is 20 characters'),
    });

    const {
        register,
        formState: { errors },
        handleSubmit,
      setValue,
    } = useForm<FormType>({
        resolver: zodResolver(validationSchema),
        mode: 'onTouched',
    });



    const handleSubmitOK = async (data: FormType) => {
        // to modify tag, we need to delete it and create new one
        const response = await fetch.delete(`/tag/${id}`, {
            headers: { Authorization: authData.Authorization },
        });

        switch (response.status) {
            case 204: {
                const response = await fetch('tag/new', {
                    data,
                    method: 'POST',
                    headers: { Authorization: authData.Authorization },
                });

                if (response.status === 200) {
                    // todo: handle
                } else {
                    // todo: handle
                }
            } break;
            case 500: {
                // todo: notify user that this tag cannot be modified because it's already used within some recipes
            }
        }
    };

    const handleSubmitError = () => {
        // todo: show notification
    };

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
                    Edit tag
                </Text>
            </Flex>

            <Card style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.15)' }}>
                <Flex direction="column" gap={20} justify="start">

                    <Blockquote color={'orange'} p={10}>
                        <Flex direction={'column'} gap={10}>

                        <Text size={'sm'}>Important notice</Text>
                        <Text size={'xs'} c={'#333'}>Only tags that are not used within recipes can be modified.</Text>
                        <Text size={'xs'} c={'#333'}>Saving of tag causes tag to be deleted and new one with new name to be created. It will have different ID after this operation.</Text>
                        </Flex>
                    </Blockquote>

                    <TextInput
                      maw={300}
                      {...register('tag')}
                      label="Tag"
                      error={errors.tag?.message}
                    />

                    <Button
                      maw={100}
                      onClick={handleSubmit(
                            handleSubmitOK,
                            handleSubmitError,
                        )}
                    >
                        Save
                    </Button>
                </Flex>
            </Card>
        </Flex>
    );
};

export { EditTagPage };
