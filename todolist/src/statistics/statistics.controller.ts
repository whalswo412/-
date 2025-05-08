import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatisticsService } from './statistics.service';
import { StatisticsResponseDto } from './dto/statistics-response.dto';

@Controller('statistics')
@ApiTags('Statistics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) {}

    @Get()
    async getUserStatistics(@Req() req): Promise<StatisticsResponseDto> {
        const userId = req.user?.id || req.user?.userId;
        return this.statisticsService.getUserStatistics(userId);
    }
}
