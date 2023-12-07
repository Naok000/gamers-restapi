import { Controller, HttpStatus, UseGuards } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  HttpCode,
  Patch,
  Req,
} from '@nestjs/common/decorators';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import RoleGuard from 'src/guards/auth-role.guard';
import { BookMark, Posting, User } from '@prisma/client';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { ProfileType } from './types/user';
import { AvatarDto } from './dto/avatar.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getLoginUserProfile(@Req() req: Request): Promise<ProfileType> {
    return this.userService.getUserProfile(req.user.id);
  }

  @Get('/bookmark')
  getOwnBookmark(@Req() req: Request): Promise<BookMark[]> {
    return this.userService.getBookmark(req.user.id);
  }

  @Get('/session-id')
  getLoginUserId(@Req() req: Request): { id: string; role: string } {
    return { id: req.user.id, role: req.user.role };
  }

  @Get('/own-posting')
  getOwnPosting(@Req() req: Request): Promise<Posting[]> {
    return this.userService.getOwnPosting(req.user.id);
  }

  @Patch('/avatar')
  updateAvatarImage(@Req() req: Request, @Body() dto: AvatarDto) {
    return this.userService.updateAvatarImage(req.user.id, dto);
  }

  @Patch()
  updateUser(
    @Req() req: Request,
    @Body() dto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.userService.updateUser(req.user.id, dto);
  }

  @UseGuards(RoleGuard('USER'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/delete_profile')
  async deleteUser(@Req() req: Request): Promise<void> {
    return this.userService.deleteUser(req.user.id);
  }
}
