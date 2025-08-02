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

export class RegisterInput {
  name: string;
  email: string;
  password: string;
}

export class LoginInput {
  email: string;
  password: string;
}

export abstract class IQuery {
  abstract _empty(): Nullable<string> | Promise<Nullable<string>>;

  abstract recipes(): Recipe[] | Promise<Recipe[]>;

  abstract recipe(id: string): Nullable<Recipe> | Promise<Nullable<Recipe>>;

  abstract me(): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
  abstract _empty(): Nullable<string> | Promise<Nullable<string>>;

  abstract createRecipe(input: CreateRecipeInput): Recipe | Promise<Recipe>;

  abstract updateRecipe(
    id: string,
    input: UpdateRecipeInput,
  ): Recipe | Promise<Recipe>;

  abstract deleteRecipe(id: string): boolean | Promise<boolean>;

  abstract register(input: RegisterInput): AuthPayload | Promise<AuthPayload>;

  abstract login(input: LoginInput): AuthPayload | Promise<AuthPayload>;
}

export class Recipe {
  id: string;
  title: string;
  description?: Nullable<string>;
  ingredients: string[];
  instructions: string;
  cookingTime: number;
  user: User;
  userId: string;
  createdAt: string;
}

export class User {
  id: string;
  name: string;
  email: string;
  role: string;
  recipes?: Nullable<Recipe[]>;
  createdAt: string;
}

export class AuthPayload {
  token: string;
  user: User;
}

type Nullable<T> = T | null;
