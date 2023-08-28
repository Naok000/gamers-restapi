import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AvatarDto {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsNotEmpty()
  @Exclude()
  userId: string;
}
