import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MembershipService } from './membership.service';
import { createUser, updateUser } from './membership.dto';
import { Membership } from './membership.entity';

@ApiTags('memberships')
@Controller('memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get()
  @ApiOperation({ summary: 'Get service status' })
  getHello(): string {
    return this.membershipService.getHello();
  }
  
  @Post()
  @ApiOperation({ summary: 'Create a new membership' })
  @ApiResponse({ status: 201, description: 'Membership created successfully' })
  async create(@Body() createUserDto: createUser): Promise<Membership> {
    return this.membershipService.create(createUserDto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all memberships' })
  async findAll(): Promise<Membership[]> {
    return this.membershipService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get membership by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Membership> {
    return this.membershipService.findOne(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get membership by email' })
  async findByEmail(@Param('email') email: string): Promise<Membership> {
    return this.membershipService.findByEmail(email);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get all memberships' })
  async findByName(@Param('name') name: string): Promise<Membership> {
    return this.membershipService.findByName(name);
  }

  @Patch(':name')
  updateName(@Param('name', ParseIntPipe) name: string, @Body() updateMembershipDto: updateUser): Promise<Membership> {
    return this.membershipService.updateName(name, updateMembershipDto);
  }

  @Patch(':email')
  updateEmail(@Param('email', ParseIntPipe) email: string, @Body() updateMembershipDto: updateUser): Promise<Membership> {
    return this.membershipService.updateEmail(email, updateMembershipDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete membership by ID' })
  async removeByID(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.membershipService.removeByID(id);
  }

  @Delete(':email')
  @ApiOperation({ summary: 'Delete membership by Email' })
  async removeByEmail(@Param('email', ParseIntPipe) email: string): Promise<void> {
    return this.membershipService.removeByEmail(email);
  }

  @Delete(':name')
  @ApiOperation({ summary: 'Delete membership by Name' })
  async removeByName(@Param('name', ParseIntPipe) name: string): Promise<void> {
    return this.membershipService.removeByName(name);
  }

}