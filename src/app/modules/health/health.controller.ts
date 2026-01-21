import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Returns "ok" if the service is up and running'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok'
        }
      }
    }
  })
  healthCheck() {
    return { status: 'ok' };
  }
}
