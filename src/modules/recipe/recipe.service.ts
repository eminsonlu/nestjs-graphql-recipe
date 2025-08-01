import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Recipe } from '../../models/recipe.model';
import { CreateRecipeDto, UpdateRecipeDto } from './dto';
import { User } from '../../models/user.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe)
    private recipeModel: typeof Recipe,
  ) {}

  async findAll(): Promise<Recipe[]> {
    return this.recipeModel.findAll({
      include: [User],
    });
  }

  async findById(id: string): Promise<Recipe | null> {
    return this.recipeModel.findByPk(id, {
      include: [User],
    });
  }

  async create(input: CreateRecipeDto, userId: number): Promise<Recipe | null> {
    const recipeData = { ...input, userId };
    const recipe = await this.recipeModel.create(recipeData);
    return this.recipeModel.findByPk(recipe.id, {
      include: [User],
    });
  }

  async update(
    id: string,
    input: UpdateRecipeDto,
    userId: number,
  ): Promise<Recipe | null> {
    const recipe = await this.recipeModel.findByPk(id);

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    if (recipe.userId !== userId) {
      throw new ForbiddenException(`You are not allowed to update this recipe`);
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
    return await this.recipeModel.findByPk(id, {
      include: [User],
    });
  }

  async delete(id: string, userId: number): Promise<boolean> {
    const recipe = await this.recipeModel.findByPk(id);

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    if (recipe.userId !== userId) {
      throw new ForbiddenException(`You are not allowed to delete this recipe`);
    }

    const deleted = await this.recipeModel.destroy({
      where: { id },
    });
    return deleted > 0;
  }
}
