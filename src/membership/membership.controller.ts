import { Controller, Get, Logger, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Membership } from './membership.entity';
import { MembershipService } from './membership.service';

@ApiTags('memberships')
@Controller('memberships')
export class MembershipController {
  private readonly logger = new Logger(MembershipController.name);

  constructor(private readonly membershipService: MembershipService) {}

  @Get()
  @ApiOperation({ summary: 'Get all memberships' })
  @ApiQuery({ name: 'deal_id', required: false, type: Number, description: 'Filter memberships by deal ID' })
  @ApiResponse({ status: 200, description: 'List of all memberships' })
  async findAll(@Query('deal_id') dealId?: string): Promise<Membership[]> {
    try {
      if (dealId) {
        return await this.membershipService.findByDealId(parseInt(dealId, 10));
      }
      return await this.membershipService.findAll();
    } catch (error) {
      this.logger.error('Error fetching memberships', error);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a membership by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Membership ID' })
  @ApiResponse({ status: 200, description: 'Membership found' })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  async findOne(@Param('id') id: string): Promise<Membership> {
    try {
      const membership = await this.membershipService.findOne(parseInt(id, 10));

      if (!membership) {
        throw new NotFoundException(`Membership with ID ${id} not found`);
      }

      return membership;
    } catch (error) {
      this.logger.error(`Error fetching membership ${id}`, error);
      throw error;
    }
  }
}
