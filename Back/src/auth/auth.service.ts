import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(credentials: RegisterDto): Promise<{ accessToken: string }> {
    const email = credentials.email.trim().toLowerCase();
    const passwordHash = await hash(credentials.password, 12);

    try {
      const user = await this.prisma.user.create({
        data: { email, passwordHash },
      });
      return this.createAccessToken(user.id, user.email, false);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('An account with this email already exists.');
      }
      throw error;
    }
  }

  async login(credentials: LoginDto): Promise<{ accessToken: string }> {
    const email = credentials.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await compare(credentials.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.createAccessToken(user.id, user.email, credentials.rememberMe ?? false);
  }

  private createAccessToken(
    userId: string,
    email: string,
    rememberMe: boolean,
  ): Promise<{ accessToken: string }> {
    const expiresIn = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60;
    return this.jwtService.signAsync(
      { sub: userId, email },
      { expiresIn },
    ).then((accessToken) => ({ accessToken }));
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return typeof error === 'object'
      && error !== null
      && 'code' in error
      && error.code === 'P2002';
  }
}
