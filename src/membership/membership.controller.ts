import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../app/modules/auth/guards';
import { Membership } from './membership.entity';
import { MembershipService } from './membership.service';
import { CreateMembershipModel, UpdateMembershipModel } from './models';

@ApiTags('memberships')
@Controller('memberships')
@UseGuards(AuthGuard)
export class MembershipController {
  private readonly logger = new Logger(MembershipController.name);

  constructor(private readonly membershipService: MembershipService) {}

  @Get()
  @ApiOperation({ summary: 'Get all memberships' })
  @ApiQuery({ name: 'deal_id', required: false, type: Number, description: 'Filter memberships by deal ID' })
  @ApiResponse({ status: 200, description: 'List of all memberships' })
  async findAll(@Query('deal_id', new ParseIntPipe({ optional: true })) dealId?: number): Promise<Membership[]> {
    try {
      if (dealId) {
        return await this.membershipService.findByDealId(dealId);
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
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Membership> {
    try {
      const membership = await this.membershipService.findOne(id);

      if (!membership) {
        throw new NotFoundException(`Membership with ID ${id} not found`);
      }

      return membership;
    } catch (error) {
      this.logger.error(`Error fetching membership ${id}`, error);
      throw error;
    }
  }

  @Post('create/:dealID')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new membership for a deal' })
  @ApiParam({ name: 'dealID', type: 'number', description: 'Deal ID' })
  @ApiBody({ type: CreateMembershipModel })
  @ApiResponse({ status: 201, description: 'Membership created successfully', type: Membership })
  @ApiResponse({ status: 400, description: 'Bad request - invalid input' })
  async create(
    @Param('dealID', ParseIntPipe) dealID: number,
    @Body() createMembershipDto: CreateMembershipModel
  ): Promise<Membership> {
    try {
      const membership = await this.membershipService.create({
        name: createMembershipDto.name,
        email: createMembershipDto.email,
        dealId: dealID
      });

      return membership;
    } catch (error) {
      this.logger.error('Error creating membership', error);
      throw error;
    }
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a membership status by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Membership ID' })
  @ApiBody({ type: UpdateMembershipModel })
  @ApiResponse({ status: 200, description: 'Membership updated successfully', type: Membership })
  @ApiResponse({ status: 400, description: 'Bad request - invalid input' })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMembershipDto: UpdateMembershipModel
  ): Promise<Membership> {
    try {
      const membership = await this.membershipService.update(id, updateMembershipDto);
      return membership;
    } catch (error) {
      this.logger.error(`Error updating membership ${id}`, error);
      throw error;
    }
  }
}
