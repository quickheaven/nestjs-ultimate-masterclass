import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PasswordService } from '../password/password.service';
import { User } from '../user.entity';
import { CreateUserDto } from '../create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  public async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.passwordService.hashPassword(
      createUserDto.password,
    );
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  public async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }
}
