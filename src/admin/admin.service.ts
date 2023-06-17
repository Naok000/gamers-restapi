import { Injectable } from '@nestjs/common';
import { Posting, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  getAllPosting(): Promise<Posting[]> {
    return this.prisma.posting.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getAllUser(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deletePostingById(postingId: string): Promise<void> {
    await this.prisma.posting.delete({ where: { id: postingId } });
  }

  async deleteUserById(userId: string): Promise<void> {
    await this.prisma.user.delete({ where: { id: userId } });
  }
}
