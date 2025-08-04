import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Rating } from './rating.model';

@Table({
  tableName: 'recipes',
  underscored: true,
})
export class Recipe extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare title: string;

  @Column(DataType.TEXT)
  declare description: string;

  @Column(DataType.ARRAY(DataType.TEXT))
  declare ingredients: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare instructions: string;

  @Column(DataType.INTEGER)
  declare cookingTime: number;

  @Column(DataType.STRING(500))
  declare imageUrl: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  @HasMany(() => Rating)
  declare ratings: Rating[];

  get averageRating(): number | null {
    if (!this.ratings || this.ratings.length === 0) {
      return null;
    }
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return Math.round(sum / this.ratings.length);
  }
}
