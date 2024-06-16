import {FC, useContext, useEffect, useState} from 'react';
import {fetch} from "../../hooks/useRequest.hook";
import {AuthContext} from "../../AuthContextType";
import {useNavigate} from "react-router";
import {TextInput} from "../forms/TextInput";
import {jsSubmit} from "../../utils/js-submit";
import {Tag} from "../../types/Tag";

const TagsPage: FC = () => {

  const { data: authData } = useContext(AuthContext);

  const [tagName, setTagName] = useState("");

  const navigate = useNavigate();

  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (authData === null) {
      navigate('/sign-in')
    }
  }, [])

  if (authData === null) {
    return <>You must login first</>;
  }

  useEffect(() => {
    (async () => {
      const response = await fetch('tag/all', { method: 'GET', headers: { Authorization: authData.Authorization } });

      if (response.status === 200) {
        setTags(response.data as Tag[]);
      }
    })()

  }, []);

  const addNewTag = () => {
    (async () => {
      const response = await fetch('tag/new', { method: 'POST', data: { tag: tagName }, headers: { Authorization: authData.Authorization } })

      if (response.status === 200) {
        setTags([...tags, response.data]);
      }

    })()
  }

  return (<>
    <h2>Tags: Administrative functions</h2>

    <TextInput value={tagName} updateValue={setTagName} label={"New tag name"} />

    <button type={'button'} onClick={jsSubmit(addNewTag)}>Add new tag</button>

    <br />

    <ul>
      { tags.map(tag => (<li key={tag.id}>{tag.tag}</li>)) }
    </ul>

  </>);
}

export { TagsPage };
