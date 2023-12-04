import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { BookMark, Comment } from '@prisma/client';
import { BoardService } from './board.service';
import { CreatePostingDto } from './dto/create-posting.dto';
import { Request } from 'express';
import { Delete, HttpCode, UseGuards } from '@nestjs/common/decorators';
import { PostingCommentDto } from './dto/posting-comment.dto';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import RoleGuard from 'src/guards/auth-role.guard';
import { commentUser, postedAll, postingById } from './types/board';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  getAllPosting(): Promise<postedAll[]> {
    return this.boardService.getAllPosting();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getPostingById(
    @Req() req: Request,
    @Param('id') postingId: string,
  ): Promise<postingById> {
    return this.boardService.getPostingById(req.user.id, postingId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/comment')
  getCommentById(@Param('id') postingId: string): Promise<commentUser[]> {
    return this.boardService.getCommentById(postingId);
  }

  @UseGuards(RoleGuard('USER'))
  @Post('/create')
  createPosting(@Req() req: Request, @Body() dto: CreatePostingDto) {
    return this.boardService.createPosting(req.user.id, dto);
  }

  @UseGuards(RoleGuard('USER'))
  @Post(':id/post-comment')
  postComment(
    @Param('id') postingId: string,
    @Req()
    req: Request,
    @Body() dto: PostingCommentDto,
  ): Promise<Comment> {
    return this.boardService.postComment(req.user.id, postingId, dto);
  }

  @UseGuards(RoleGuard('USER'))
  @Post(':id/book-mark')
  registerBookMark(
    @Param('id') postingId: string,
    @Req() req: Request,
  ): Promise<BookMark> {
    return this.boardService.registerBookMark(req.user.id, postingId);
  }

  @UseGuards(RoleGuard('USER'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/book-mark')
  async removeBookMark(
    @Param('id') postingId: string,
    @Req() req: Request,
  ): Promise<void> {
    return this.boardService.removeBookMark(req.user.id, postingId);
  }

  @UseGuards(RoleGuard('USER'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deletePosting(
    @Param('id') postingId: string,
    @Req() req: Request,
  ): Promise<void> {
    return this.boardService.deletePostingById(req.user.id, postingId);
  }
}
