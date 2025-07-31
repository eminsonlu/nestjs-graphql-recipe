/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateRecipeInput {
  title: string;
  description?: Nullable<string>;
  ingredients: string[];
  instructions: string;
  cookingTime: number;
}

export class UpdateRecipeInput {
  title?: Nullable<string>;
  description?: Nullable<string>;
  ingredients?: Nullable<string[]>;
  instructions?: Nullable<string>;
  cookingTime?: Nullable<number>;
}

export class Recipe {
  id: string;
  title: string;
  description?: Nullable<string>;
  ingredients: string[];
  instructions: string;
  cookingTime: number;
}

export abstract class IQuery {
  abstract recipes(): Recipe[] | Promise<Recipe[]>;

  abstract recipe(id: string): Nullable<Recipe> | Promise<Nullable<Recipe>>;
}

export abstract class IMutation {
  abstract createRecipe(input: CreateRecipeInput): Recipe | Promise<Recipe>;

  abstract updateRecipe(
    id: string,
    input: UpdateRecipeInput,
  ): Recipe | Promise<Recipe>;

  abstract deleteRecipe(id: string): boolean | Promise<boolean>;
}

type Nullable<T> = T | null;
