import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class PostingCommentDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @Exclude()
  timestamp: Date;

  @Exclude()
  userId: string;

  @Exclude()
  postingId: string;
}
