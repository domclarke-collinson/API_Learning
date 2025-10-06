import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './membership.entity';
import { createUser, updateUser } from './membership.dto';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
  ) {}

  async create(createUserDto: createUser): Promise<Membership> {
    const membership = this.membershipRepository.create({
      email: createUserDto.email,
      name: createUserDto.name || createUserDto.email.split('@')[0], // Use username or email prefix
    });
    return this.membershipRepository.save(membership);
  }

  async findAll(): Promise<Membership[]> {
    return this.membershipRepository.find();
  }

  async findOne(id: number): Promise<Membership> {
    return this.membershipRepository.findOne({ where: { id } }) as Promise<Membership>;
  }

  async findByEmail(email: string): Promise<Membership> {
    return this.membershipRepository.findOne({ where: { email } }) as Promise<Membership>;
  }

  async findByName(name: string): Promise<Membership> {
    return this.membershipRepository.findOne({ where: { name } }) as Promise<Membership>;
  }

  async updateName(name: string, updateMembershipDto: updateUser): Promise<Membership> {
    await this.membershipRepository.update(name, updateMembershipDto);
    return this.findByName(name);
  }
  async updateEmail(email: string, updateMembershipDto: updateUser): Promise<Membership> {
    await this.membershipRepository.update(email, updateMembershipDto);
    return this.findByEmail(email);
  }

  async removeByID(id: number): Promise<void> {
    await this.membershipRepository.delete(id);
  }

  async removeByEmail(email: string): Promise<void> {
    await this.membershipRepository.delete(email);
  }

  async removeByName(name: string): Promise<void> {
    await this.membershipRepository.delete(name);
  }

  getHello(): string {
    return 'Membership Service is running!';
  }
}