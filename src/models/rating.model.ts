import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Max,
  Min,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Recipe } from './recipe.model';
import { User } from './user.model';

@Table({
  tableName: 'ratings',
  underscored: true,
})
export class Rating extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Min(1)
  @Max(5)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare rating: number;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare comment?: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  @ForeignKey(() => Recipe)
  @Column(DataType.INTEGER)
  declare recipeId: number;

  @BelongsTo(() => Recipe)
  declare recipe: Recipe;
}
