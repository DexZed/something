import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StatsService } from './stats.service.js';
import { RoleGuard } from '../common/guard/role.guard.js';
import { Roles } from '../common/guard/roles.decorator.js';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

@ApiTags('Stats')
@Controller('stats')
@UseGuards(RoleGuard)
@Roles('admin')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('overview')
  // @ZodResponse({ type: OverviewSchema })
  @ApiResponse({ summary: 'Get overview of stats' })
  async getOverview() {
    const data = await this.statsService.getOverview();
    return { data };
  }

  @Get('latest')
  @ApiResponse({ summary: 'Get latest stats' })
  async getLatest(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const data = await this.statsService.getLatest(limit);
    return { data };
  }

  @Get('charts')
  // @ZodResponse({ type: ChartSchema })
  @ApiResponse({ summary: 'Get charts data' })
  async getCharts() {
    const data = await this.statsService.getCharts();
    return { data };
  }
}
