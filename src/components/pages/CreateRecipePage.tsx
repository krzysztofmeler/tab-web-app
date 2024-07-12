import React, { FC, useState } from 'react';
import {
    Button,
    Card,
    Chip,
    Fieldset,
    Flex,
    InputError,
    NumberInput,
    Select,
    Space,
    Text,
    Textarea,
    TextInput,
} from '@mantine/core';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconTrash } from '@tabler/icons-react';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';
import { fetch } from '../../hooks/useRequest.hook';
import { Tag } from '../../types/Tag';
import { useAsyncEffect } from '../../hooks/useAsyncEffect.hook';
import { Unit } from '../../types/Unit';
import { Ingredient } from '../../types/Ingredient';
import { AddIngredientToRecipeRequestData } from '../../types/backend-api/AddIngredientToRecipeRequestData';

type FormTypeIngredient = {
    ingredientId: number | null;
    unitId: number | null;
    amount: number;
};

type FormType = {
    name: string;
    description: string;
    category: string;
    steps: string[];
    tagIds: number[];
    ingredients: FormTypeIngredient[];
};

const availableCategories: string[] = [
    'cakes',
    'desserts',
    'dinners',
    'fast-food',
    'breakfast',
    'quick',
    'category n',
    'category n+1',
    'category n+2',
    'category n+3',
    'category n+4',
];

const CreateRecipePage: FC = () => {
    const validationSchema = z.object({
        name: z
            .string()
            .min(10, 'Minimal length is 10 characters.')
            .max(80, 'Maximal length is 80 characters'),
        description: z
            .string()
            .min(50, 'Minimal length is 50 characters.')
            .max(500, 'Maximal length is 500 characters'),
        category: z.string({ message: 'Category selection is required.' }),
        steps: z
            .array(
                z
                    .string()
                    .min(5, 'Minimal length is 5 characters.')
                    .max(120, 'Maximal length is 120 characters'),
            )
            .max(30, 'You can specify at most 30 steps.'),
        tagIds: z
            .array(z.number())
            .min(1, 'Pick at least one tag.')
            .max(6, 'Number of tags should not exceed 6.'),
        ingredients: z
            .array(
                z.object({
                    ingredientId: z.number({
                        message: 'Ingredient must be selected',
                    }),
                    unitId: z.number({ message: 'Unit must be selected' }),
                    amount: z.number({ message: 'Amount value is invalid' }),
                }),
            )
            .min(1, 'At least one ingredient is required.'),
    });

    const {
        control,
        register,
        getValues,
        watch,
        setValue,
        formState: { errors },
        handleSubmit,
        trigger,
    } = useForm<FormType>({
        resolver: zodResolver(validationSchema),
        mode: 'onTouched',
        defaultValues: {
            tagIds: [],
            category: undefined,
            steps: [],
            ingredients: [],
            name: '',
            description: '',
        },
    });

    const { data: authData } = useAuthContextRedirect();

    if (!authData) return <>Login first</>; // todo

    const [tagList, setTagList] = useState<Tag[]>([]);

    const [units, setUnits] = useState<Unit[]>([]);

    const [ingredientList, setIngredientList] = useState<Ingredient[]>([]);

    useAsyncEffect(async () => {
        const getTagsResponse = await fetch('tag/all', {
            method: 'GET',
            headers: { Authorization: authData.Authorization },
        });

        if (getTagsResponse.status === 200) {
            setTagList(getTagsResponse.data as Tag[]);
        }

        const getUnitsResponse = await fetch('/unit/all', {
            method: 'GET',
            headers: { Authorization: authData.Authorization },
        });

        if (getUnitsResponse.status === 200) {
            setUnits(getUnitsResponse.data as Unit[]);
        }

        const getIngredientsResponse = await fetch('/ingredient/all', {
            method: 'GET',
            headers: { Authorization: authData.Authorization },
        });

        if (getIngredientsResponse.status === 200) {
            setIngredientList(getIngredientsResponse.data as Ingredient[]);
        }
    }, []);

    const handleSubmitOK = async ({
        tagIds,
        category,
        ingredients,
        ...data
    }: FormType) => {
        // todo: handle tags upload
        try {
            const response = await fetch.post(
                'recipe/new',
                {
                    ...data,
                    tags: [],
                    categories: [category],
                },
                {
                    auth: {
                        username: authData!.email,
                        password: authData!.password,
                    },
                },
            );

            if (response.status === 200) {
                const createdRecipeId = response.data.id;

                await Promise.all(
                    tagIds.map((tagId) =>
                        fetch.post(
                            `recipe/${createdRecipeId}/tags/${tagId}`,
                            tagId,
                            {
                                auth: {
                                    username: authData!.email,
                                    password: authData!.password,
                                },
                            },
                        ),
                    ),
                );

                await Promise.all(
                    ingredients.map((ingredient) =>
                        fetch.post(
                            'ingredients/recipes/new',
                            {
                                ...ingredient,
                                recipeId: createdRecipeId,
                            } as AddIngredientToRecipeRequestData,
                            {
                                auth: {
                                    username: authData!.email,
                                    password: authData!.password,
                                },
                            },
                        ),
                    ),
                );

                console.log('ok');
            } else {
                // todo
            }
        } catch (error) {}
    };

    const handleSubmitError = () => {
        // todo
    };

    const [steps, setSteps] = useState<string[]>([]);

    watch(({ steps: formSteps }) => {
        if (formSteps) {
            trigger('steps');
            setSteps(formSteps as string[]);
        }
    });

    const addStep = () => {
        setValue('steps', [...getValues().steps, 'step x']);
    };

    const deleteStep = (index: number) => {
        setValue(
            'steps',
            getValues().steps.filter((_, i) => i !== index),
        );
    };

    const updateStep = (index: number, value: string) => {
        const newSteps = getValues().steps.map((step, i) => {
            if (index === i) {
                return value;
            }
            return step;
        });

        setValue('steps', newSteps);
    };

    const [ingredients, setIngredients] = useState<FormTypeIngredient[]>([]);

    watch(({ ingredients: formIngredients }) => {
        if (formIngredients) {
            // trigger('ingredients');
            setIngredients(formIngredients as FormTypeIngredient[]);
        }
    });

    const addIngredient = () => {
        setValue('ingredients', [
            ...getValues().ingredients,
            { ingredientId: null, unitId: null, amount: 0 },
        ]);
    };

    const deleteIngredient = (index: number) => {
        setValue(
            'ingredients',
            getValues().ingredients.filter((_, i) => i !== index),
        );
    };

    const updateIngredientAmount = (index: number, value: number) => {
        const newIngredients = getValues().ingredients.map((ingredient, i) => {
            if (index === i) {
                ingredient.amount = value;
            }

            return ingredient;
        });

        setValue('ingredients', newIngredients);

        trigger(`ingredients.${index}.amount`);
    };

    const updateIngredientSelection = (index: number, value: string) => {
        const newIngredients = getValues().ingredients.map((ingredient, i) => {
            if (index === i) {
                ingredient.ingredientId = Number.parseInt(value, 10);
            }

            return ingredient;
        });

        setValue('ingredients', newIngredients);
        trigger(`ingredients.${index}.ingredientId`);
    };

    const updateIngredientUnit = (index: number, value: string) => {
        const newIngredients = getValues().ingredients.map((ingredient, i) => {
            if (index === i) {
                ingredient.unitId = Number.parseInt(value, 10);
            }

            return ingredient;
        });

        setValue('ingredients', newIngredients);
        trigger(`ingredients.${index}.unitId`);
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
                    Create recipe
                </Text>
            </Flex>

            <Card style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.15)' }}>
                <Flex direction="column" justify="start">
                    <TextInput
                      maw={300}
                      {...register('name')}
                      label="Name of recipe"
                      error={errors.name?.message}
                    />
                    <Space h={20} />
                    <Textarea
                      autosize
                      maw={700}
                      {...register('description')}
                      label="Description"
                      error={errors.description?.message}
                    />

                    <Space h={20} />

                    <Controller
                      control={control}
                      name="tagIds"
                      render={({
                            field: { onChange, onBlur, value, ref },
                        }) => (
                            <Flex gap={8}>
                                {tagList.map((tag) => (
                                    <Chip
                                      key={tag.id}
                                      onChange={(checked) => {
                                            let updatedValue;
                                            if (checked) {
                                                updatedValue = [
                                                    ...value,
                                                    tag.id,
                                                ];
                                            } else {
                                                updatedValue = value.filter(
                                                    (v) => v !== tag.id,
                                                );
                                            }

                                            onChange({
                                                target: {
                                                    value: updatedValue,
                                                },
                                            });
                                        }}
                                    >
                                        {tag.tag}
                                    </Chip>
                                ))}
                            </Flex>
                        )}
                    />

                    <Space h={6} />

                    {errors.tagIds?.message && (
                        <InputError w="100%">
                            {errors.tagIds.message}
                        </InputError>
                    )}

                    <Space h={20} />

                    <Controller
                      control={control}
                      name="category"
                      render={({
                            field: { onChange, onBlur, value, ref },
                        }) => (
                            <Select
                              maw={300}
                              data={availableCategories}
                              label="Category"
                              error={errors.category?.message}
                              value={value}
                              onChange={(value) =>
                                    onChange({
                                        target: {
                                            value,
                                        },
                                    })
                                }
                            />
                        )}
                    />

                    <Space h={20} />

                    <Fieldset legend="Steps">
                        <Flex gap={10} direction="column">
                            {steps.map((step, index) => (
                                <Flex gap={8} align="start" key={index}>
                                    <Text pt={7} w={20}>
                                        {index + 1}.
                                    </Text>
                                    <TextInput
                                      error={errors.steps?.[index]?.message}
                                      w="calc(100% - 80px )"
                                      value={step}
                                      onChange={(e) =>
                                            updateStep(index, e.target.value)
                                        }
                                    />
                                    <Button
                                      onClick={() => deleteStep(index)}
                                      variant="light"
                                    >
                                        <IconTrash size={18} />
                                    </Button>
                                </Flex>
                            ))}
                            <Button maw={130} onClick={addStep}>
                                Add step
                            </Button>
                        </Flex>
                    </Fieldset>

                    {errors.steps?.message && (
                        <>
                            <Space h={3} />
                            <InputError>{errors.steps.message}</InputError>
                        </>
                    )}

                    <Space h={20} />

                    <Fieldset legend="Ingredients">
                        <Flex gap={10} direction="column">
                            {ingredients.map((ingredient, index) => (
                                <Flex gap={8} align="start" key={index}>
                                    <Select
                                      w="60%"
                                      error={
                                            errors.ingredients?.[index]
                                                ?.ingredientId?.message
                                        }
                                      allowDeselect={false}
                                      onChange={(value) =>
                                            updateIngredientSelection(
                                                index,
                                                value as string,
                                            )
                                        }
                                      value={
                                            ingredient.ingredientId?.toString() ||
                                            ''
                                        }
                                      data={ingredientList!.map((le) => ({
                                            value: le.id.toString(),
                                            label: le.ingredient,
                                        }))}
                                      placeholder="Select name"
                                    />
                                    <NumberInput
                                      w="20%"
                                      error={
                                            errors.ingredients?.[index]?.amount
                                                ?.message
                                        }
                                      allowNegative={false}
                                      value={ingredient.amount}
                                      onChange={(e) =>
                                            updateIngredientAmount(
                                                index,
                                                e as number,
                                            )
                                        }
                                    />
                                    <Select
                                      w="20%"
                                      error={
                                            errors.ingredients?.[index]?.unitId
                                                ?.message
                                        }
                                      allowDeselect={false}
                                      onChange={(value) =>
                                            updateIngredientUnit(
                                                index,
                                                value as string,
                                            )
                                        }
                                      value={
                                            ingredient.unitId?.toString() || ''
                                        }
                                      data={units!.map((le) => ({
                                            value: le.id.toString(),
                                            label: le.unit,
                                        }))}
                                      placeholder="Select unit"
                                    />
                                    <Button
                                      onClick={() => deleteIngredient(index)}
                                      variant="light"
                                    >
                                        <IconTrash size={18} />
                                    </Button>
                                </Flex>
                            ))}
                            <Button maw={170} onClick={addIngredient}>
                                Add ingredient
                            </Button>
                        </Flex>
                    </Fieldset>

                    {errors.ingredients?.message && (
                        <>
                            <Space h={3} />
                            <InputError>
                                {errors.ingredients.message}
                            </InputError>
                        </>
                    )}

                    <Space h={20} />

                    <Button
                      maw={100}
                      onClick={handleSubmit(
                            handleSubmitOK,
                            handleSubmitError,
                        )}
                    >
                        Create
                    </Button>
                </Flex>
            </Card>
        </Flex>
    );
};

export { CreateRecipePage };
