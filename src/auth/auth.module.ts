import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { DonorModule } from 'src/donor/donor.module';
import { PrismaService } from 'prisma/prisma.service';
@Module({
  imports: [
    UserModule,
    DonorModule,
    PassportModule,
    JwtModule.register({
      secret: 'mohammed123',
      signOptions: { expiresIn: '100d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,PrismaService],
  exports: [AuthService, JwtModule], // Export JwtModule to make JwtService available
})
export class AuthModule {}
