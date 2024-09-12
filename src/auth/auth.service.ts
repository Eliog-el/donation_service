import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UsersService } from 'src/users/users.service';
import { HashingService } from './hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { SignInDto } from 'src/users/dto/sign-in.dto';
import { User } from 'src/users/entities/user.entity';
import { ActiveUserData } from './interfaces/active-user-data-interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    try {
      const user = this.usersService.create(createUserDto);

      return user;
    } catch (err) {
      if (err.response) {
        return err.response; // Return custom error response
      }
      throw new BadRequestException('Failed to register user');
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findUserByEmail(signInDto.email);

    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException(
        "The password that you've entered is incorrect",
      );
    }

    return await this.generateToken(user);
  }

  async generateToken(user: User) {
    const [accessToken, refreashToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshAccessTokenTtl),
    ]);

    return { accessToken, refreashToken };
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );
  }
}
