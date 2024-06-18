import {FC, useEffect, useState} from 'react';
import {
    Button,
    Card, Checkbox,
    FormGroup,
    H2,
    InputGroup,
    Label, MenuItem, NumericInput,
    TextArea,
} from '@blueprintjs/core';
import { jsSubmit } from '../../utils/js-submit';
import { fetch } from '../../hooks/useRequest.hook';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';
import {useAsyncEffect} from "../../hooks/useAsyncEffect.hook";
import {BasicSelector} from "../forms/BasicSelector";
import {Ingredient, Unit} from "../../types/Recipe";
import {Tag} from "../../types/Tag";
import {ItemRenderer, MultiSelect} from "@blueprintjs/select";

type IngredientFormData = {
    localId: string;
    unitName: string;
    unitId: string;
    ingredientId: string;
    ingredientName: string;
    value: number;
}

const AddRecipePage: FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [ingredientValue, setIngredientValue] = useState<number>(1);
    const [ingredientUnitId, setIngredientUnitId] = useState<string | null>(null);
    const [ingredientId, setIngredientId] = useState<string | null>(null);

    const [steps, setSteps] = useState<string[]>(['step 001', 'step 002']);
    const [tags, setTags] = useState<number[]>([]);

    const [units, setUnits] = useState<Unit[]>([]);


    const { data: authData } = useAuthContextRedirect();

    const [ingredients, setIngredients] = useState<IngredientFormData[]>([])
    const [allIngredients, setAllIngredients] = useState<Ingredient[]>([])

    const [allTags, setAllTags] = useState<Tag[]>([]);

    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    useAsyncEffect(async () => {
        if (authData) {
            const response = await fetch.get('/tag/all', { headers: { Authorization: authData.Authorization } });

            if (response.status === 200) {
                setAllTags(response.data);
            }
        }
    }, [])

    useAsyncEffect(async () => {
        if (authData) {
            const response = await fetch.get('/unit/all', { headers: { Authorization: authData.Authorization } });

            if (response.status === 200) {
                setUnits(response.data);
            }
        }
    }, []);

    useAsyncEffect(async () => {
        if (authData) {
            const response = await fetch.get('/ingredient/all', { headers: { Authorization: authData.Authorization } });

            if (response.status === 200) {
                setAllIngredients(response.data);
            }
        }
    }, [])

    if (authData === null) {
        return <>You must log in first</>
    }

    const create = async () => {
        try {
            const response = await fetch.post(
                'recipe/new',
                {
                    name,
                    description,
                    steps,
                    tags: [],
                    categories: ['hardcoded in AddRecipePage'], // todo
                },
                {
                    auth: {
                        username: authData!.email,
                        password: authData!.password,
                    },
                },
            );

            if (response.status === 200) {

                const recipeId = response.data.id;

                selectedTags.forEach(tag => {
                    fetch.post(`recipe/${recipeId}/tags/${tag.id}`, null, { headers: { Authorization: authData.Authorization } });
                })

                ingredients.forEach(ingredient => {

                    fetch.post('ingredients/recipes/new', {
                        "recipeId": recipeId,
                        "ingredientId": Number.parseInt(ingredient.ingredientId),
                        "unitId": Number.parseInt(ingredient.unitId),
                        "amount": ingredientValue
                    }, { headers: { Authorization: authData.Authorization } })

                })

            } else {
                // todo
            }
        } catch (error) {}
    };

    const addIngredient = () => {

        if (! ingredientUnitId || !ingredientId || ! units.find(u => u.id.toString() === ingredientUnitId)) {
            return;
        }

        const newIngredient: IngredientFormData = {
            localId: Math.random().toString(),
            unitId: ingredientUnitId!,
            unitName: units.find(u => u.id.toString() === ingredientUnitId)!.unit,
            value: ingredientValue,
            ingredientId: ingredientId,
            ingredientName: allIngredients.find(i => i.id.toString() === ingredientId)!.ingredient,
        }

        setIngredientValue(0);
        setIngredientUnitId(null);
        setIngredientId(null);
        setIngredients([...ingredients, newIngredient]);
    }


    const handleTagClick = (tagId: number, checked: boolean) => {
        if (checked) {
            const tag: Tag = allTags.find(t => t.id === tagId)!;

            setSelectedTags([...selectedTags, tag]);
        } else {
            setSelectedTags(selectedTags.filter(t => t.id !== tagId));
        }
    }


    return (
        <div className="middle spaced">
            <Card>
                <H2>Add recipe</H2>

                <FormGroup>
                    <Label htmlFor="name-input">Name</Label>
                    <InputGroup
                      id="name-input"
                      value={name}
                      onValueChange={setName}
                      title="Name"
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="description-input">Description</Label>
                    <TextArea
                      id="description-input"
                      onChange={(e) => setDescription(e.target.value)}
                      defaultValue={description}
                    />
                </FormGroup>

                { ingredients.length && <>
                    { ingredients.map(ingredient => {
                        return <div key={ingredient.localId}>
                            {ingredient.ingredientName}: { ingredient.value } [{ingredient.unitName}]
                        </div>
                    }) }
                </> }

                <div className={'flex'}>


                <BasicSelector values={allIngredients.map(i => ([i.id.toString(), i.ingredient]))} value={ingredientId} updateValue={v => setIngredientId(v)} label={'Ingredient'} />
                <NumericInput onValueChange={(e) => { setIngredientValue(e) }} value={ingredientValue} />
                <BasicSelector values={units.map(u => ([u.id.toString(), u.unit]))} value={ingredientUnitId} updateValue={v => setIngredientUnitId(v)} label={'Unit'} />

                <Button onClick={jsSubmit(addIngredient)} icon={'add'}>Add ingredient</Button>


                </div>

                <br />

                    <p>Tags:</p>

                    <br />

                    { allTags.map(tag => <div className={'flex'} key={tag.id}>
                    <Checkbox id={`tag-select-${tag.id}`} onChange={e => handleTagClick(tag.id, e.target.checked)} />
                    <Label htmlFor={`tag-select-${tag.id}`}>{tag.tag}</Label>
                        <br />
                    </div>) }


                <br />

                <Button
                  onClick={jsSubmit(create)}
                  aria-label="Create recipe"
                  intent="primary"
                >
                    Create
                </Button>
            </Card>
        </div>
    );
};

export { AddRecipePage };
