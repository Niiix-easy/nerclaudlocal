import { Controller, Post, UseGuards } from '@nestjs/common';
import { SystemService } from './system.service';

@Controller('api/system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Post('update')
  // Ideally, add a strict @UseGuards() here for Admin-only access
  async triggerUpdate() {
    return this.systemService.triggerUpdate();
  }
}
