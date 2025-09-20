import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class UsersService {
	constructor(
		private readonly logger: LoggerService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async findAll(): Promise<User[]> {
		return this.userRepository.find();
	}

	async findOne(id: number): Promise<User | null> {
		return this.userRepository.findOneBy({ id });
	}

	async create(user: { name: string, job: string }): Promise<User | { error: string }> {
		if (user && user.name) {
			const newUser = this.userRepository.create({ name: user.name, job: user.job });
			await this.userRepository.save(newUser);
			this.logger.log(`User ${user.name} created.`);
			return newUser;
		}
		return { error: 'Invalid user data' };
	}
}
