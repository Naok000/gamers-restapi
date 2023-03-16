import { Body, Controller, Get, Post, Req, Param } from '@nestjs/common';
import { Posting } from '@prisma/client';
import { BoardService } from './board.service';
import { CreatePostingDto } from './dto/create-posting.dto';
import { Request } from 'express';
import { UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  getAllPosting(): Promise<Posting[]> {
    return this.boardService.getAllPosting();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getPostingById(@Param('id') postingId: string): Promise<Posting> {
    return this.boardService.getPostingById(postingId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  createPosting(
    @Req() req: Request,
    @Body() dto: CreatePostingDto,
  ): Promise<Posting> {
    return this.boardService.createPosting(req.user.id, dto);
  }
}
