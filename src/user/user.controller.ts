import { Controller, UseGuards } from '@nestjs/common';
import { Body, Get, Patch, Req } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getLoginUser(@Req() req: Request): Omit<User, 'password'> {
    return req.user;
  }

  @Get('/session-id')
  getLoginUserId(@Req() req: Request): { id: string; role: string } {
    return { id: req.user.id, role: req.user.role };
  }

  @Patch()
  @Patch()
  updateUser(
    @Req() req: Request,
    @Body() dto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.userService.updateUser(req.user.id, dto);
  }
}
