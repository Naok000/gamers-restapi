import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  getAllPosting(): Promise<{ user: { userName: string } }[]> {
    return this.prisma.posting.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        user: {
          select: {
            userName: true,
          },
        },
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
