import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Rating } from 'src/models/rating.model';
import { RatingService } from './rating.service';
import { RatingResolver } from './rating.resolver';

@Module({
  imports: [SequelizeModule.forFeature([Rating])],
  providers: [RatingService, RatingResolver],
  exports: [RatingService],
})
export class RatingModule {}
