import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsOptional,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(255, { message: 'Title cannot be longer than 255 characters' })
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, {
    message: 'Description cannot be longer than 1000 characters',
  })
  description?: string;

  @IsArray({ message: 'Ingredients must be an array' })
  @ArrayMinSize(1, { message: 'At least one ingredient is required' })
  @IsString({ each: true, message: 'Each ingredient must be a string' })
  @IsNotEmpty({ each: true, message: 'Ingredients cannot be empty' })
  ingredients: string[];

  @IsString()
  @IsNotEmpty({ message: 'Instructions are required' })
  @MaxLength(5000, {
    message: 'Instructions cannot be longer than 5000 characters',
  })
  instructions: string;

  @IsOptional()
  @IsInt({ message: 'Cooking time must be an integer' })
  @Min(1, { message: 'Cooking time must be at least 1 minute' })
  @Max(1440, { message: 'Cooking time cannot exceed 24 hours (1440 minutes)' })
  cookingTime?: number;
}
