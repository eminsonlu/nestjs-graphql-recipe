import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Unique,
  HasMany,
} from 'sequelize-typescript';
import { Recipe } from './recipe.model';
import { Rating } from './rating.model';

@Table({
  tableName: 'users',
  underscored: true,
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare name: string;

  @Unique
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM('user', 'admin'),
    defaultValue: 'user',
  })
  declare role: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare isActive: boolean;

  @HasMany(() => Recipe)
  declare recipes: Recipe[];

  @HasMany(() => Rating)
  declare ratings: Rating[];
}
