import { Controller, Get, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { currentUser } from "../auth/decorator/current.user.decorator";
import { PayloadDto } from "../auth/dto/auth.dto";

@Controller("dashboard")
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("overview")
  async getOverview(@currentUser() user: PayloadDto) {
    return this.dashboardService.getOverview(user.id!);
  }

  @Get("trends")
  async getTrends() {
    return this.dashboardService.getTrends();
  }

  @Get("alerts")
  async getAlerts() {
    return this.dashboardService.getAlerts();
  }
}
