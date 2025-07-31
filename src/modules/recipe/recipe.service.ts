import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Recipe } from '../../models/recipe.model';
import { CreateRecipeDto, UpdateRecipeDto } from './dto';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe)
    private recipeModel: typeof Recipe,
  ) {}

  async findAll(): Promise<Recipe[]> {
    return this.recipeModel.findAll();
  }

  async findById(id: string): Promise<Recipe | null> {
    return this.recipeModel.findByPk(id);
  }

  async create(input: CreateRecipeDto): Promise<Recipe> {
    const recipeData = { ...input };
    return this.recipeModel.create(recipeData);
  }

  async update(id: string, input: UpdateRecipeDto): Promise<Recipe> {
    const recipe = await this.recipeModel.findByPk(id);

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    const updateData: Partial<UpdateRecipeDto> = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined)
      updateData.description = input.description;
    if (input.ingredients !== undefined)
      updateData.ingredients = input.ingredients;
    if (input.instructions !== undefined)
      updateData.instructions = input.instructions;
    if (input.cookingTime !== undefined)
      updateData.cookingTime = input.cookingTime;

    await recipe.update(updateData);
    return recipe;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.recipeModel.destroy({
      where: { id },
    });
    return deleted > 0;
  }
}
