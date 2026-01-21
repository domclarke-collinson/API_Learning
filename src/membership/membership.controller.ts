import { Controller, Get, Param, Post, Body, HttpCode, HttpStatus, NotFoundException, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { MembershipService } from './membership.service';
import { Membership } from './membership.entity';
import { CreateMembershipModel } from './models';

@ApiTags('memberships')
@Controller('memberships')
export class MembershipController {
  private readonly logger = new Logger(MembershipController.name);

  constructor(private readonly membershipService: MembershipService) {}

  @Get()
  @ApiOperation({ summary: 'Get all memberships' })
  @ApiResponse({ status: 200, description: 'List of all memberships' })
  async findAll(): Promise<Membership[]> {
    try {
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

//   @Post('/enroll/:email')
//   @HttpCode(HttpStatus.CREATED)
//   @ApiOperation({ summary: 'Create a new membership' })
//   @ApiResponse({ status: 201, description: 'Membership created successfully' })
//   async createMembershipByEmail(@Param('email') email: string): Promise<Membership> {
//     try {
//       return await this.membershipService.create(CreateMembershipModel);
//     } catch (error) {
//       this.logger.error('Error creating membership', error);
//       throw error;
//     }
//   }
}