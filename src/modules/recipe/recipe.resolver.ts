import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto, UpdateRecipeDto } from './dto';

@Resolver('Recipe')
export class RecipeResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @Query('recipes')
  async getRecipes() {
    return this.recipeService.findAll();
  }

  @Query('recipe')
  async getRecipe(@Args('id') id: string) {
    return this.recipeService.findById(id);
  }

  @Mutation('createRecipe')
  async createRecipe(@Args('input') input: CreateRecipeDto) {
    return this.recipeService.create(input);
  }

  @Mutation('updateRecipe')
  async updateRecipe(
    @Args('id') id: string,
    @Args('input') input: UpdateRecipeDto,
  ) {
    return this.recipeService.update(id, input);
  }

  @Mutation('deleteRecipe')
  async deleteRecipe(@Args('id') id: string) {
    return this.recipeService.delete(id);
  }
}
