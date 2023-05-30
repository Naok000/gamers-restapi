import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthDto } from './dto/auth.dto';
import { Csrf } from './interface/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/csrf')
  getCsrfToken(@Req() req: Request): Csrf {
    return { csrfToken: req.csrfToken() };
  }

  @Post('/signup')
  async signUp(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const jwt = await this.authService.signUp(dto);
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const jwt = await this.authService.login(dto);
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // 空文字にすることでcookieのリセット
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
  }
}
