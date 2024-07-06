import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { RegisterUserDto, LoginUserDto } from './dtos';
import { UsersService } from './users.service';
import { GetAuthGuard } from './guards/user-auth.guard';

@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/auth/register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.usersService.register(registerUserDto);
  }

  @Post('/auth/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get('/api/users/:id')
  @UseGuards(GetAuthGuard)
  async get(@Param('id') id: string) {
    return this.usersService.get(id);
  }
}
