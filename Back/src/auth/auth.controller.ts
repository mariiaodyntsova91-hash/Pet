import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() credentials: RegisterDto): Promise<{ accessToken: string }> {
    return this.authService.register(credentials);
  }

  @Post('login')
  login(@Body() credentials: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(credentials);
  }
}
