import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Rating } from '../../models/rating.model';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating)
    private ratingModel: typeof Rating,
  ) {}

  async createRating(
    input: CreateRatingDto,
    recipeId: number,
    userId: number,
  ): Promise<Rating | null> {
    console.log(
      'Creating rating with input:',
      input,
      'for recipeId:',
      recipeId,
      'by userId:',
      userId,
    );
    const rating = await this.ratingModel.create({
      ...input,
      recipeId,
      userId,
    });
    return this.ratingModel.findByPk(rating.id, {
      include: ['user', 'recipe'],
    });
  }

  async deleteRating(id: number, userId: number): Promise<boolean> {
    const rating = await this.ratingModel.findByPk(id);

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    if (rating.userId !== userId) {
      throw new UnauthorizedException(
        'This rating not belongs to current user',
      );
    }

    const deleted = await this.ratingModel.destroy({
      where: { id },
    });

    return deleted > 0;
  }
}
