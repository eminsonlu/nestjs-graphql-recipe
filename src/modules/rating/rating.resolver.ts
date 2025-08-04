import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { User } from 'src/models/user.model';

@Resolver('Rating')
export class RatingResolver {
  constructor(private readonly ratingService: RatingService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation('createRating')
  async createRating(
    @Args('recipeId') id: number,
    @Args('input') input: CreateRatingDto,
    @CurrentUser() user: User,
  ) {
    return this.ratingService.createRating(input, id, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('deleteRating')
  async deleteRating(@Args('recipeId') id: number, @CurrentUser() user: User) {
    return this.ratingService.deleteRating(id, user.id);
  }
}
