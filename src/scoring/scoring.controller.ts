import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ScoringService } from "./scoring.service";
import { CreateCriteriaDto } from "./dto/create-criteria.dto";

@Controller("scoring")
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Post("criteria")
  create(@Body() dto: CreateCriteriaDto) {
    return this.scoringService.create(dto);
  }

  @Get("criteria")
  findAll() {
    return this.scoringService.findAll();
  }


  @Post("recalculate-all")
async recalculateAll() {
  return this.scoringService.recalculateAllStudentsScores();
}

@Delete('criteria/:id')
deleteOne(@Param('id', ParseIntPipe) id: number) {
  return this.scoringService.deleteOne(id);
}


}
