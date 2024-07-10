import React, { FC, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { jsSubmit } from '../../utils/js-submit';
import { AuthContext } from '../../AuthContextType';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';
import {
  Button,
  Card,
  Chip,
  Flex,
  InputError,
  InputLabel,
  Select,
  Space,
  Text,
  Textarea,
  TextInput
} from "@mantine/core";
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { fetch } from '../../hooks/useRequest.hook';
import {Tag} from "../../types/Tag";
import {useAsyncEffect} from "../../hooks/useAsyncEffect.hook";

type FormType = {
  name: string;
  description: string;
  category: string;
  steps: string[];
  tagIds: number[];
}

const availableCategories: string[] = [
  "cakes",
  "desserts",
  "dinners",
  "fast-food",
  "breakfast",
  "quick",
  "category n",
  "category n+1",
  "category n+2",
  "category n+3",
  "category n+4",
]

const CreateRecipePage: FC = () => {

  const validationSchema = z.object({
    name: z.string().min(10, "Minimal length is 10 characters.").max(80, "Maximal length is 80 characters"),
    description: z.string().min(50, "Minimal length is 50 characters.").max(500, "Maximal length is 500 characters"),
    category: z.string({message: "Category selection is required."}),
    steps: z.array( z.string().min(5, "Minimal length is 5 characters.").max(120, "Maximal length is 120 characters")),
    tagIds: z.array(z.number()).min(1, "Pick at least one tag.").max(6, "Number of tags should not exceed 6."),
  });

  const { control, register, formState: { errors }, handleSubmit } = useForm<FormType>({
    resolver: zodResolver(validationSchema),
    mode: 'onTouched',
    defaultValues: {
      tagIds: [],
      category: undefined,
      steps: [],
      name: '',
      description: '',
    }
  })

    const { data: authData } = useAuthContextRedirect();

  if (!authData) return <>Login first</>; // todo

  const [tags, setTags] = useState<Tag[]>([]);

  useAsyncEffect(async () => {
    const response = await fetch('tag/all', {
      method: 'GET',
      headers: { Authorization: authData.Authorization },
    });

    if (response.status === 200) {
      setTags(response.data as Tag[]);
    }
  }, []);

    const handleSubmitOK = async ({ tagIds, category, ...data }: FormType) => {
      // todo: handle tags upload
        try {
            const response = await fetch.post(
                'recipe/new',
              {
                ...data,
                tags: [],
                steps: ["todo", "todo"], // todo
                categories: [category],
              },
                {
                    auth: {
                        username: authData!.email,
                        password: authData!.password,
                    },
                },
            );

            if (response.status !== 200) {
                // todo
            }
        } catch (error) {}
    };

    const handleSubmitError = () => {
      // todo
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
            Create recipe
          </Text>
        </Flex>

        <Card
          style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.15)' }}
        >
          <Flex direction={'column'} justify={'start'}>
            <TextInput maw={300} {...register('name')} label={'Name of recipe'} error={errors.name?.message} />
            <Space h={20} />
            <Textarea maw={700} {...register('description')} label={'Description'} error={errors.description?.message} />

            <Space h={20} />

            <Controller
              control={control}
              name="tagIds"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Flex gap={8}>
                  { tags.map(tag => (
                    <Chip onChange={(checked) => {
                      let updatedValue;
                      if (checked) {
                        updatedValue = [...value, tag.id];
                      } else {
                        updatedValue = value.filter(v => v !== tag.id)
                      }

                      onChange({
                        target: {
                          value: updatedValue,
                        }
                      })
                    }}
                    >{tag.tag}</Chip>
                  ))}

                </Flex>
              )}
            />

            <Space h={6} />

            { errors.tagIds?.message && ( <InputError w={'100%'}>{errors.tagIds.message}</InputError> ) }


            <Space h={20} />

            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Select maw={300} data={availableCategories} label={'Category'} error={errors.category?.message} value={value} onChange={value => onChange({
                  target: {
                    value,
                  }
                })} />
              )} />

            <Space h={20} />

            <Button maw={100} onClick={handleSubmit(handleSubmitOK, handleSubmitError)}>
              Create
            </Button>
          </Flex>
        </Card>
      </Flex>
    );
};

export { CreateRecipePage };
