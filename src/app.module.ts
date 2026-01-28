import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { DonorModule } from './donor/donor.module';
import { DonationModule } from './donation/donation.module';
import { LocationModule } from './location/location.module';
import { DropoutReasonModule } from './dropout-reason/dropout-reason.module';
import { DonationPurposeModule } from './donation-purpose/donation-purpose.module';
import { GuardianModule } from './guardian/guardian.module';
import { SchoolModule } from './school/school.module';
import { StudentModule } from './student/student.module';
import { FollowUpVisitModule } from './follow-up-visit/follow-up-visit.module';
import { DocumentModule } from './document/document.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NotificationModule } from './notification/notification.module';
import { SupportProgramModule } from './support-program/support-program.module';
import { ReportsModule } from './reports/reports.module';
import { MulterModule } from './documentManager/documentManager.module';
import { DeviceTokensModule } from './device-tokens/device-tokens.module';
import { FcmModule } from './notification/fcm.module';
import { ScoringModule } from './scoring/scoring.module';
import { ExpenseModule } from './expense/expense.module';


@Module({
  imports: [
     UserModule,
     ActivityLogModule,
     AuthModule,
     MulterModule,
     FcmModule,
     DeviceTokensModule,
     DonorModule,
     DonationModule,
     LocationModule, 
     DropoutReasonModule,
     DonationPurposeModule,
     GuardianModule,
     SchoolModule, 
     StudentModule,
     FollowUpVisitModule,
     DocumentModule,
     DashboardModule,
     NotificationModule,
     SupportProgramModule,
     ReportsModule,
     ScoringModule,
     ExpenseModule
                ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
