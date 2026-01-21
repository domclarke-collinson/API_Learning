import { Controller, Get, Param, NotFoundException, Logger, Query, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DealService } from './deal.service';
import { Deal } from './deal.entity';
import { DealResponseModel } from './models';
import { DealStatus } from './deal-enums';

@ApiTags('deals')
@Controller('deals')
export class DealController {
  private readonly logger = new Logger(DealController.name);

  constructor(private readonly dealService: DealService) {}

  @Get()
  @ApiOperation({ summary: 'Get all deals' })
  @ApiQuery({ name: 'client_id', required: false, type: Number, description: 'Filter deals by client ID' })
  @ApiQuery({ 
    name: 'status', 
    required: false, 
    enum: DealStatus, 
    description: 'Filter deals by status' 
  })
  @ApiResponse({ status: 200, description: 'List of all deals' })
  async findAll(
    @Query('client_id') clientId?: string,
    @Query('status') status?: string,
  ): Promise<DealResponseModel[]> {
    try {
      let deals: Deal[];
      
      if (clientId) {
        deals = await this.dealService.findByClientId(parseInt(clientId, 10));
      } else if (status) {
        // Validate and convert string to DealStatus enum
        const dealStatus = this.validateDealStatus(status);
        deals = await this.dealService.findByStatus(dealStatus);
      } else {
        deals = await this.dealService.findAll();
      }
      
      return DealResponseModel.fromEntities(deals);
    } catch (error) {
      this.logger.error('Error fetching deals', error);
      throw error;
    }
  }

  @Get(':dealId')
  @ApiOperation({ summary: 'Get a deal by ID' })
  @ApiParam({ name: 'dealId', type: 'number', description: 'Deal ID' })
  @ApiResponse({ status: 200, description: 'Deal found' })
  @ApiResponse({ status: 404, description: 'Deal not found' })
  async findOne(@Param('dealId') dealId: string): Promise<DealResponseModel> {
    try {
      const deal = await this.dealService.findOne(parseInt(dealId, 10));
      
      if (!deal) {
        throw new NotFoundException(`Deal with ID ${dealId} not found`);
      }
      
      return DealResponseModel.fromEntity(deal);
    } catch (error) {
      this.logger.error(`Error fetching deal ${dealId}`, error);
      throw error;
    }
  }

  private validateDealStatus(status: string): DealStatus {
    // Convert string to uppercase to match enum values
    const upperStatus = status.toUpperCase();
    
    // Check if the status is a valid enum value
    if (Object.values(DealStatus).includes(upperStatus as DealStatus)) {
      return upperStatus as DealStatus;
    }
    
    throw new BadRequestException(
      `Invalid status: ${status}. Valid values are: ${Object.values(DealStatus).join(', ')}`
    );
  }
}