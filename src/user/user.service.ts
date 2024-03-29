import { ForbiddenException, Injectable } from '@nestjs/common';
import { BookMark, Posting, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileType } from './types/user';
import { AvatarDto } from './dto/avatar.dto';

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
        avatar: { select: { avatarImgURL: true, avatarFileName: true } },
      },
    });

    return userProfile;
  }

  async getBookmark(userId: string): Promise<BookMark[]> {
    const getOwnBookmark = await this.prisma.bookMark.findMany({
      where: { userId },
    });

    return getOwnBookmark;
  }

  async updateAvatarImage(userId: string, dto: AvatarDto) {
    const userAvatar = await this.prisma.avatar.update({
      where: { userId: userId },
      data: { ...dto },
    });
    return userAvatar;
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
