import {FC, useContext, useEffect, useState} from 'react';
import { TextInput } from '../forms/TextInput';
import { jsSubmit } from '../../utils/js-submit';
import { fetch } from '../../hooks/useRequest.hook';
import {AuthContext} from "../../AuthContextType";
import {useNavigate} from "react-router";

const AddRecipePage: FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [steps, setSteps] = useState<string[]>(['hardcoded']);
    const [tags, setTags] = useState<string[]>(['hardcoded']);

    const navigate = useNavigate();

    const {data: authData} = useContext(AuthContext);

    useEffect(() => {
      if (authData === null) {
        navigate('/sign-in');
      }
    }, [])

    const create = async () => {
        try {
            const response = await fetch.post('recipe/new', {
                name,
                description,
                steps,
                tags,
                categories: ['hardcoded in AddRecipePage'], // todo
            }, {
              auth: {
                username: authData!.email,
                password: authData!.password,
              }
            });

            if (response.status !== 200) {
                // todo
            }
        } catch (error) {}
    };

    return (
        <>
            <h1>Add recipe</h1>

            <TextInput value={name} updateValue={setName} label="Name" />

            <TextInput
              value={description}
              updateValue={setDescription}
              label="Description"
            />

            <button type="button" onClick={jsSubmit(create)}>
                Create
            </button>
        </>
    );
};

export { AddRecipePage };
