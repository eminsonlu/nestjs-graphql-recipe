import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

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
}
