import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { Comment, Posting } from '@prisma/client';
import { BoardService } from './board.service';
import { CreatePostingDto } from './dto/create-posting.dto';
import { Request } from 'express';
import { Delete, HttpCode, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { PostingCommentDto } from './dto/posting-comment.dto';

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
  @Get(':id/comment')
  getCommentById(@Param('id') postingId: string): Promise<Comment[]> {
    return this.boardService.getCommentById(postingId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  createPosting(
    @Req() req: Request,
    @Body() dto: CreatePostingDto,
  ): Promise<Posting> {
    return this.boardService.createPosting(req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/post-comment')
  postComment(
    @Param('id') postingId: string,
    @Req()
    req: Request,
    @Body() dto: PostingCommentDto,
  ): Promise<Comment> {
    return this.boardService.postComment(req.user.id, postingId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deletePosting(
    @Param('id') postingId: string,
    @Req() req: Request,
  ): Promise<void> {
    return this.boardService.deletePostingById(req.user.id, postingId);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/comment')
  async deleteComment(
    @Param('id') postingId: string,
    @Req() req: Request,
  ): Promise<void> {
    return this.boardService.deleteCommentById(req.user.id, postingId);
  }
}
