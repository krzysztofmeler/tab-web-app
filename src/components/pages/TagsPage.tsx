import {FC, useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {fetch} from "../../hooks/useRequest.hook";
import {AuthContext} from "../../AuthContextType";
import {useNavigate} from "react-router";
import {TextInput} from "../forms/TextInput";
import {jsSubmit} from "../../utils/js-submit";

const TagsPage: FC = () => {

  const { data: authData } = useContext(AuthContext);

  const [tagName, setTagName] = useState("");

  const navigate = useNavigate()

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
      const response = await fetch('tag/all', { method: 'GET', headers: { Authorization: `Basic ${btoa(authData.email + ":" + authData.password)}` } });

      console.log(response.data);

    })()

  }, []);

  const addNewTag = () => {
    (async () => {
      const response = await fetch('tag/new', { method: 'POST', data: { tag: tagName }, headers: { Authorization: `Basic ${btoa(authData.email + ':' + authData.password)}` } })
      console.dir(response.data);
    })()
  }

  return (<>
    <h2>Tags: Administrative functions</h2>

    <TextInput value={tagName} updateValue={setTagName} label={"New tag name"} />

    <button type={'button'} onClick={jsSubmit(addNewTag)}>Add new tag</button>

  </>);
}

export { TagsPage };
