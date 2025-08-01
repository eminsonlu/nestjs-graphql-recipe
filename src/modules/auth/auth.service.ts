import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { User } from '../../models/user.model';
import { RegisterDto, LoginDto } from './dto';
import { AuthPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async register(input: RegisterDto): Promise<AuthPayload> {
    const existingUser = await this.userModel.findOne({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await this.userModel.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: 'user',
    });

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      token,
      user,
    };
  }

  async login(input: LoginDto): Promise<AuthPayload> {
    const user = await this.userModel.findOne({
      where: { email: input.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      token,
      user,
    };
  }

  async validateUser(userId: number): Promise<User | null> {
    return this.userModel.findByPk(userId);
  }

  async findById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }
}
