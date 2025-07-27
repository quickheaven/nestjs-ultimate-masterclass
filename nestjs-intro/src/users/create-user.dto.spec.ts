import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { PaginationParams } from '../common/pagination.params';

describe('CreateUserDto', () => {
  let dto = new CreateUserDto();

  beforeEach(() => {
    dto = new CreateUserDto();
    dto.email = 'ajie.io@yahoo.com';
    dto.name = 'Ajie';
    dto.password = 'password123A#';
  });

  it('should validate complete data', async () => {
    // Arrange
    // Act
    const errors = await validate(dto);
    // Assert
    expect(errors.length).toBe(0);
  });

  it('should fail in invalid email', async () => {
    // Arrange
    dto.email = 'test';
    // Act
    const errors = await validate(dto);
    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  const testPassword = async (password: string, expectedError: string) => {
    dto.password = password;
    const errors = await validate(dto);
    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError).not.toBeUndefined();
    const messages = Object.values(passwordError?.constraints ?? {});
    expect(messages).toContain(expectedError);
  };

  it('should fail without 1 upper case letter', async () => {
    await testPassword(
      'abcdfa',
      'Password must contain at least 1 uppercase letter',
    );
  });

  it('should fail without 1 number', async () => {
    await testPassword('abcdfA', 'Password must contain at least 1 number');
  });

  it('should fail without at least 1 special character', async () => {
    await testPassword(
      'abdefaA1',
      'Password must contain at least 1 special character',
    );
  });
});
