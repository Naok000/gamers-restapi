import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { Jwt } from './interface/auth.interface';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async signUp(dto: AuthDto): Promise<Jwt> {
    const uuid = uuidv4();
    const { userName, email, url, password, fileName } = { ...dto };
    const hashed = await bcrypt.hash(password, 12);
    const avatarId = uuidv4();

    try {
      const user = await this.prisma.user.findFirst({
        where: { userName: userName },
      });
      if (user) throw new ForbiddenException('This username is already taken');
      await this.prisma.user.create({
        data: {
          id: uuid,
          userName,
          email,
          password: hashed,
          role: UserRole.USER,
          avatar: {
            create: {
              id: avatarId,
              avatarImgURL: url,
              avatarFileName: fileName,
            },
          },
        },
      });
      return this.generateJwt(uuid, email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('This email is already taken');
        }
      }
    }
  }

  async login(dto: AuthDto): Promise<Jwt> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new ForbiddenException('Email or Password incorrect');
    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new ForbiddenException('Email or Password incorrect');
    return this.generateJwt(user.id, user.email);
  }

  async generateJwt(userId: string, email: string): Promise<Jwt> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: secret,
    });
    return {
      accessToken: token,
    };
  }
}
