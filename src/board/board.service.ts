import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Posting } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostingDto } from './dto/create-posting.dto';

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
}
