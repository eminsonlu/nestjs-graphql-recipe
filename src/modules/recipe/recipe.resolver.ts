import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto, UpdateRecipeDto } from './dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from 'src/models/user.model';

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

  @UseGuards(GqlAuthGuard)
  @Mutation('createRecipe')
  async createRecipe(
    @Args('input') input: CreateRecipeDto,
    @CurrentUser() user: User,
  ) {
    return this.recipeService.create(input, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('updateRecipe')
  async updateRecipe(
    @Args('id') id: string,
    @Args('input') input: UpdateRecipeDto,
    @CurrentUser() user: User,
  ) {
    return this.recipeService.update(id, input, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('deleteRecipe')
  async deleteRecipe(@Args('id') id: string, @CurrentUser() user: User) {
    return this.recipeService.delete(id, user.id);
  }
}
