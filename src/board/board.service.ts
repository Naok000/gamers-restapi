import { ForbiddenException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Comment } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostingDto } from './dto/create-posting.dto';
import { PostingCommentDto } from './dto/posting-comment.dto';
import { commentUser, postedAll, postingById } from './types/board';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPosting(): Promise<postedAll[]> {
    const allPosting = await this.prisma.posting.findMany({
      select: {
        id: true,
        gameTitle: true,
        title: true,
        content: true,
        thumbnail: { select: { imageURL: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return allPosting;
  }

  getPostingById(postingId: string): Promise<postingById> {
    return this.prisma.posting.findUnique({
      where: { id: postingId },
      select: {
        id: true,
        userId: true,
        title: true,
        content: true,
        gameTitle: true,
        createdAt: true,
        thumbnail: {
          select: { imageURL: true, thumbnailFileName: true },
        },
        user: {
          select: {
            userName: true,
            avatar: { select: { avatarImgURL: true } },
          },
        },
      },
    });
  }

  getCommentById(postingId: string): Promise<commentUser[]> {
    return this.prisma.comment.findMany({
      where: { postingId },
      select: {
        id: true,
        comment: true,
        timestamp: true,
        userId: true,
        user: {
          select: {
            userName: true,
            avatar: { select: { avatarImgURL: true } },
          },
        },
      },
    });
  }

  async createPosting(userId: string, dto: CreatePostingDto) {
    const postingId: string = uuidv4();
    const thumbnailId: string = uuidv4();
    const {
      gameTitle,
      content,
      imageURL,
      title,
      createdAt,
      updatedAt,
      thumbnailFileName,
    } = {
      ...dto,
    };

    const posting = await this.prisma.posting.create({
      data: {
        id: postingId,
        userId,
        thumbnailId,
        gameTitle,
        title,
        content,
        createdAt,
        updatedAt,
      },
    });
    const thumbnailImage = await this.prisma.thumbnail.create({
      data: {
        id: thumbnailId,
        postingId,
        imageURL,
        thumbnailFileName,
      },
    });
    const postWithImage = {
      id: posting.id,
      gameTitle: posting.gameTitle,
      title: posting.title,
      thumbnail: { imageURL: thumbnailImage.imageURL },
    };
    return postWithImage;
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
      include: { thumbnail: {} },
    });
  }

}
