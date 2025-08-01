import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { AuthPayload } from './types';
import { User } from '../../models/user.model';
import { CurrentUser } from './decorators/current-user.decorator';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('register')
  async register(@Args('input') input: RegisterDto): Promise<AuthPayload> {
    return this.authService.register(input);
  }

  @Mutation('login')
  async login(@Args('input') input: LoginDto): Promise<AuthPayload> {
    return this.authService.login(input);
  }

  @UseGuards(GqlAuthGuard)
  @Query('me')
  me(@CurrentUser() user: User): Promise<User> {
    return Promise.resolve(user);
  }
}
