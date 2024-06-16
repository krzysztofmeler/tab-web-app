import {User} from "./User";

type Recipe = {
  id: number;
  name: string;
  categories: string[],
  description: string,
  steps: string[],
  tags: string[],
}

type RecipeWithOwner = Recipe & { owner: User }

type Rating = {
  id: number;
  recipe: RecipeWithOwner;
  user: User;
  rating: number;
  date: string;
}

export type { Recipe, RecipeWithOwner, Rating }
