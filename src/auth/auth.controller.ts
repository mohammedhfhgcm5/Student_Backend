import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, DonorForgotPasswordDto, ForgotPasswordDto, PayloadDto } from './dto/auth.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { CreateDonorDto } from '../donor/dto/create-donor.dto';
import type { Response } from 'express'; 
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { currentUser } from './decorator/current.user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🔹 تسجيل الدخول للمستخدمين العاديين (ADMIN, NGO_STAFF, FIELD_TEAM)
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.logIn(dto);
  }

  // 🔹 إنشاء حساب لموظفي الـ NGO أو الفريق الميداني
  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @Post('send-code-forgot-password')
  async forgotPassword(@Body() dto: DonorForgotPasswordDto) {
    return this.authService.sendForgotPassword(dto.email);
  }
  @Post('send-code-forgot-password')
  async validateResetCode(@Body() dto: {email:string , code:string}) {
    return this.authService.validateResetCode(dto);
  }

  // 🔹 تعديل بيانات مستخدم موجود
  @Put('edit/:id')
  editDetails(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.authService.editDetails(+id, dto);
  }

  // 🔹 نسيان كلمة المرور (للـ NGO / FieldTeam)
  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  forgotPasswords(@Body() dto: ForgotPasswordDto, @currentUser() user: PayloadDto,) {
    return this.authService.ResetPassword(dto,user);
  }

  // ============ Donor Auth Endpoints ============

  @Post('donor-signin')
  donorSignin(@Body() dto: AuthDto) {
    return this.authService.DonorlogIn(dto);
  }

  @Post('donor-signup')
  async donorSignup(@Body() dto: CreateDonorDto) {
    return this.authService.DonorsignUp(dto);
  }

  @Put('donor-edit/:id')
  donorEdit(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.authService.DonorEditDetails(+id, dto);
  }

  @Post('donor-forgot-password')
  donorForgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.DonorforgotPassword(dto);
  }
   @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    const html = await this.authService.verifyEmail(token);
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }
}
