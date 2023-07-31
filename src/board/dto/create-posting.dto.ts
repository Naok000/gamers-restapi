import { Exclude } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostingDto {
  @IsString()
  @IsNotEmpty()
  gameTitle: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  userId: string;
}
