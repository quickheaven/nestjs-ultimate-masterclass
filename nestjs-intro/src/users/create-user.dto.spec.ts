import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('2+2=4', () => {
    expect(2 + 2).toBe(4);
  });
});

describe('CreateUserDto', () => {
  it('should validate email, name, and password', async () => {
    // Arrange
    const dto = new CreateUserDto();
    dto.email = 'ajie.io@yahoo.com';
    dto.name = 'Ajie';
    dto.password = 'password123';
    // Act
    const errors = await validate(dto);
    // Assert
    expect(errors.length).toBe(0);
  });
});
