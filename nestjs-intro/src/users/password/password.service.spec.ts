import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash and verify password', async () => {
    const mockedHash = 'hashedPassword';
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockedHash);
    const password = 'password123';
    const result = await service.hashPassword(password);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, service['SALT_ROUNDS']);
    expect(result).toBe(mockedHash);
  });

  it('should correctly verify a password', async () => {
    const password = 'password123';
    const hashedPassword = 'hashedPassword';
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const isMatch = await service.verify(password, hashedPassword);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(isMatch).toBe(true);
  });

  it('should fail on incorrect password', async () => {
    const password = 'wrongPassword';
    const hashedPassword = 'hashedPassword';
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const isMatch = await service.verify(password, hashedPassword);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(isMatch).toBe(false);
  });
});
