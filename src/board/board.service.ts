import { ForbiddenException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Comment, Posting } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostingDto } from './dto/create-posting.dto';
import { PostingCommentDto } from './dto/posting-comment.dto';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

  getAllPosting(): Promise<Posting[]> {
    return this.prisma.posting.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getPostingById(postingId: string): Promise<Posting> {
    return this.prisma.posting.findUnique({ where: { id: postingId } });
  }

  getCommentById(postingId: string): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: { postingId },
    });
  }

  async createPosting(userId: string, dto: CreatePostingDto): Promise<Posting> {
    const id: string = uuidv4();
    const posting = await this.prisma.posting.create({
      data: {
        id: id,
        userId,
        ...dto,
      },
    });
    return posting;
  }

  async postComment(
    userId: string,
    postingId: string,
    dto: PostingCommentDto,
  ): Promise<Comment> {
    const id: string = uuidv4();
    const comment = await this.prisma.comment.create({
      data: { id: id, userId, postingId, ...dto },
    });
    return comment;
  }

  async deletePostingById(userId: string, postingId: string): Promise<void> {
    const posting = await this.prisma.posting.findUnique({
      where: { id: postingId },
    });
    if (!posting || posting.userId !== userId) {
      throw new ForbiddenException('No permission to delete');
    }

    await this.prisma.posting.delete({
      where: { id: postingId },
    });
  }

  async deleteCommentById(userId: string, postingId: string): Promise<void> {
    // const comment = await this.prisma.comment.findUnique();
  }
}
