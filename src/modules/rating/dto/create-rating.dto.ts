import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRatingDto {
  @IsNumber()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating cannot exceed 5' })
  @IsNotEmpty({ message: 'Rating is required' })
  rating: number;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Comment cannot be longer than 500 characters' })
  comment?: string;
}
