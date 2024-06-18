import React, {FC, useState} from 'react';
import {Recipe} from "../../types/Recipe";
import {useAsyncEffect} from "../../hooks/useAsyncEffect.hook";
import {fetch} from "../../hooks/useRequest.hook";
import {useAuthContextRedirect} from "../../hooks/useAuthContextRedirect.hook";
import {Button, Card, H2} from "@blueprintjs/core";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";

const MainPage: FC = () => {

  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const navigate = useNavigate();

  const { data: authData } = useAuthContextRedirect();

  useAsyncEffect(async () => {

    if (authData) {
      const response = await fetch.get('recipe/all', {
        headers: { Authorization: authData.Authorization },
      });

      if (response.status === 200) {
        setRecipes(response.data);
      }
    }


  }, [authData]);


  if (authData === null) return <>You must login first</>;




  return (

    <div className={'middle spaced'}>

      <H2>Hello</H2>

      <H2>Some recipes</H2>

      <div className={'recipe-list-main-page'}>


      {recipes.slice(0, 8).map((recipe) => (

        <Link
          key={recipe.id}
          to={`/recipe/${recipe.id}/${encodeURIComponent(
            recipe.name,
          )}`}
        >

            <Card>
              <p className={'bp5-text-large'}>{recipe.name}</p>
              <p>
                {recipe.description.slice(0, 120)}
                {recipe.description.length > 120 ? '...' : ''}
              </p>
            </Card>
        </Link>

      ))}

      </div>

      <br />

      <Button onClick={() => navigate('/recipes')}>Show all recipes</Button>

    </div>
  );

};

export { MainPage };
