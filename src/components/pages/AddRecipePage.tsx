import { FC, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
    Button,
    Card,
    FormGroup,
    H2,
    InputGroup,
    Label,
    TextArea,
} from '@blueprintjs/core';
import { TextInput } from '../forms/TextInput';
import { jsSubmit } from '../../utils/js-submit';
import { fetch } from '../../hooks/useRequest.hook';
import { AuthContext } from '../../AuthContextType';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';

const AddRecipePage: FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [steps, setSteps] = useState<string[]>(['step 001', 'step 002']);
    const [tags, setTags] = useState<number[]>([]);

    const { data: authData } = useAuthContextRedirect();

    const create = async () => {
        try {
            const response = await fetch.post(
                'recipe/new',
                {
                    name,
                    description,
                    steps,
                    tags,
                    categories: ['hardcoded in AddRecipePage'], // todo
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
