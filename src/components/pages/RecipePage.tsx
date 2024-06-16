import {FC, useState} from 'react';
import {useAuthContextRedirect} from "../../hooks/useAuthContextRedirect.hook";
import {useAsyncEffect} from "../../hooks/useAsyncEffect.hook";
import {fetch} from "../../hooks/useRequest.hook";
import {useParams} from "react-router";
import {Recipe} from "../../types/Recipe";

const RecipePage: FC = () => {

  const {data: authData} = useAuthContextRedirect();

  if (authData === null) {
    return <>You must login first</>
  }

  const {id} = useParams() as {id: string};

  const [ recipe, setRecipe ] = useState<Recipe | null>(null);

  useAsyncEffect(async () => {
    const response = await fetch.get(`recipe/${id}`, { headers: { Authorization: authData.Authorization } });

    if (response.status === 200) {
      setRecipe(response.data);
    }
  }, [])

  if (recipe === null) {
    return <>Loading recipe...</>
  }

  return <>
  <h2>Recipe</h2>

    <p>{recipe.name}</p>
    <p>{recipe.description}</p>
    { recipe.categories.map(c => <p key={c}>Category: {c}</p>) }

    <p>Steps:</p>
    <ol>
      { recipe.steps.map(step => <li key={step}>{step}</li>) }
    </ol>

  </>;
}

export { RecipePage };
