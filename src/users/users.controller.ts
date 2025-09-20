import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../common/auth.guard';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	findAll() {
		return this.usersService.findAll();
	}

    @UseGuards(AuthGuard)
    @Get('protected')
    getProtected() {
        return 'This route is protected!';
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
    }

    

    @Post()
    create(@Body() user: CreateUserDto) {
        return this.usersService.create(user);
    }
}
