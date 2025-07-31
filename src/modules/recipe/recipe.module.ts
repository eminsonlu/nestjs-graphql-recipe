import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Recipe } from 'src/models/recipe.model';
import { RecipeService } from './recipe.service';
import { RecipeResolver } from './recipe.resolver';

@Module({
  imports: [SequelizeModule.forFeature([Recipe])],
  providers: [RecipeService, RecipeResolver],
  exports: [RecipeService],
})
export class RecipeModule {}
