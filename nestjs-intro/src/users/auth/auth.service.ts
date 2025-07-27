import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../create-user.dto';
import { User } from '../user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(createUserDto: CreateUserDto): Promise<User> {
    const exitingUser = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    if (exitingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = this.userService.createUser(createUserDto);

    return user;
  }
}
