import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import RoleGuard from 'src/guards/auth-role.guard';

@UseGuards(RoleGuard('ADMIN'))
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/posting')
  getAllPosting(): Promise<{ user: { userName: string } }[]> {
    return this.adminService.getAllPosting();
  }

  @Get('/user')
  getAllUser() {
    return this.adminService.getAllUser();
  }

  @Delete('/posting/:id')
  DeletePostingById(@Param('id') postingId: string): Promise<void> {
    return this.adminService.deletePostingById(postingId);
  }

  @Delete('/user/:id')
  DeleteUserById(@Param('id') userId: string): Promise<void> {
    return this.adminService.deleteUserById(userId);
  }
}
