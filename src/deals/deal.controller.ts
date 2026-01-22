import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DealStatus } from './deal-enums';
import { Deal } from './deal.entity';
import { DealService } from './deal.service';
import { CreateDealModel, DealResponseModel, UpdateDealModel } from './models';

@ApiTags('deals')
@Controller('deals')
export class DealController {
  private readonly logger = new Logger(DealController.name);

  constructor(private readonly dealService: DealService) {}

  @Get()
  @ApiOperation({ summary: 'Get all deals' })
  @ApiQuery({ name: 'client_id', required: false, type: String, description: 'Filter deals by client ID' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: DealStatus,
    description: 'Filter deals by status'
  })
  @ApiResponse({ status: 200, description: 'List of all deals' })
  async findAll(@Query('client_id') clientId?: string, @Query('status') status?: string): Promise<DealResponseModel[]> {
    try {
      let deals: Deal[];

      if (clientId) {
        deals = await this.dealService.findByClientId(clientId);
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

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new deal' })
  @ApiBody({ type: CreateDealModel })
  @ApiResponse({ status: 201, description: 'Deal created successfully', type: DealResponseModel })
  @ApiResponse({ status: 400, description: 'Bad request - invalid input' })
  async create(@Body() createDealDto: CreateDealModel): Promise<DealResponseModel> {
    try {
      const deal = await this.dealService.create({
        clientId: createDealDto.client_id,
        status: createDealDto.status
      });

      return DealResponseModel.fromEntity(deal);
    } catch (error) {
      this.logger.error('Error creating deal', error);
      throw error;
    }
  }

  @Patch('update/:dealId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a deal status by ID' })
  @ApiParam({ name: 'dealId', type: 'number', description: 'Deal ID' })
  @ApiBody({ type: UpdateDealModel })
  @ApiResponse({ status: 200, description: 'Deal updated successfully', type: DealResponseModel })
  @ApiResponse({ status: 400, description: 'Bad request - invalid input' })
  @ApiResponse({ status: 404, description: 'Deal not found' })
  async updateStatus(
    @Param('dealId') dealId: string,
    @Body() updateDealDto: UpdateDealModel
  ): Promise<DealResponseModel> {
    try {
      const deal = await this.dealService.update(parseInt(dealId, 10), updateDealDto);
      return DealResponseModel.fromEntity(deal);
    } catch (error) {
      this.logger.error(`Error updating deal ${dealId}`, error);
      throw error;
    }
  }
}
