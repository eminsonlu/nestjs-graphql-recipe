import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../auth.service';
import { User } from '../../../models/user.model';

type MockUserModel = {
  findOne: jest.Mock;
  create: jest.Mock;
};

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let userModel: MockUserModel;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'user',
    isActive: true,
  };

  beforeEach(async () => {
    const mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User), useValue: mockUserModel },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken(User));
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create a new user and return auth payload', async () => {
      const registerDto = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      };

      userModel.findOne.mockResolvedValue(null);
      userModel.create.mockResolvedValue(mockUser);
      (jwtService.sign as jest.Mock).mockReturnValue('mock-jwt-token');
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);

      const result = await service.register(registerDto);

      expect(userModel.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(userModel.create).toHaveBeenCalled();
      expect(result.token).toBe('mock-jwt-token');
      expect(result.user).toBe(mockUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      };

      userModel.findOne.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should return auth payload for valid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      userModel.findOne.mockResolvedValue(mockUser);
      (jwtService.sign as jest.Mock).mockReturnValue('mock-jwt-token');
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.login(loginDto);

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user).toBe(mockUser);
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const loginDto = {
        email: 'notfound@example.com',
        password: 'password123',
      };

      userModel.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      userModel.findOne.mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false as never);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
