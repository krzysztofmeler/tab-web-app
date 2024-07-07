import { FC, useState } from 'react';
import { fetch } from '../../hooks/useRequest.hook';
import { Tag } from '../../types/Tag';
import { useAsyncEffect } from '../../hooks/useAsyncEffect.hook';
import { useAuthContextRedirect } from '../../hooks/useAuthContextRedirect.hook';
import {Button, Card, Flex, Group, Text} from "@mantine/core";
import {Link} from "react-router-dom";

const TagsPage: FC = () => {
    const [tagName, setTagName] = useState('');

    const [tags, setTags] = useState<Tag[]>([]);

    const { data: authData } = useAuthContextRedirect();

    if (authData === null) {
        return <>You must login first</>;
    }

    useAsyncEffect(async () => {
        const response = await fetch('tag/all', {
            method: 'GET',
            headers: { Authorization: authData.Authorization },
        });

        if (response.status === 200) {
            setTags(response.data as Tag[]);
        }
    }, []);

    const addNewTag = () => {
        (async () => {
            const response = await fetch('tag/new', {
                method: 'POST',
                data: { tag: tagName },
                headers: { Authorization: authData.Authorization },
            });

            if (response.status === 200) {
                setTags([...tags, response.data]);
            }
        })();
    };

    const deleteTag = (id: number) => {

    }

    return (
        <Flex maw={800} gap={20} mx={'auto'} my={50} direction={'column'} justify={'stretch'}>
          <Flex justify={'space-between'}>

            <Text component={'h2'} size={'xl'}>Tags</Text>

            <Button component={Link} to={'/administration/create-tag'}>Create tag</Button>

          </Flex>

          <Flex direction={'column'} gap={15}>
            { tags.map(tag => (

              <Card key={tag.id}
                    style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.15)' }}

              >
                <Flex justify={'space-between'} align={'center'}>
                  <Text>{tag.tag}</Text>

                  <Group gap={15}>
                    <Button variant={'light'} onClick={() => deleteTag(tag.id)}>
                      Delete
                    </Button>
                    <Button component={Link} to={`/administration/edit-tag/${tag.id}`}>
                      Edit
                    </Button>
                  </Group>
                </Flex>
              </Card>

            )) }
          </Flex>


        </Flex>
    );
};

export { TagsPage };
