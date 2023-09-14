import { ForbiddenException, Injectable } from '@nestjs/common';
import { Posting, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileType } from './types/user';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getOwnPosting(userId: string): Promise<Posting[]> {
    const ownerPosting = await this.prisma.posting.findMany({
      where: { userId },
    });

    return ownerPosting;
  }

  async getUserProfile(userId: string): Promise<ProfileType> {
    const userProfile = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        userName: true,
        createdAt: true,
        avatar: { select: { avatarImgURL: true } },
      },
    });

    return userProfile;
  }

  async updateUser(
    userId: string,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { ...dto },
    });
    delete user.password;
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.id !== userId) {
      throw new ForbiddenException('No permission to delete');
    }

    await this.prisma.user.delete({ where: { id: userId } });
  }
}
