import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Request,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user.entity';
import { CreateUserDto } from '../create-user.dto';
import { LoginDto } from '../login.dto';
import { LoginResponse } from '../login.response';
import { AuthRequest } from '../auth.request';
import { UserService } from '../user/user.service';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  strategy: 'excludeAll',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @Public() // This decorator marks the route as public, bypassing the AuthGuard
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = this.authService.register(createUserDto);
    return user;
  }

  @Post('login')
  @Public() // This decorator marks the route as public, bypassing the AuthGuard
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const accessToken = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    return new LoginResponse({ accessToken });
  }

  @Get('/profile')
  async profile(@Request() request: AuthRequest): Promise<User> {
    const user = await this.userService.findOne(request.user.sub);

    if (user) {
      return user;
    }

    throw new NotFoundException();
  }
}
