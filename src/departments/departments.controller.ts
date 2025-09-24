import { Controller, Post, Body, Put, Param, Delete, Get } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from './department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  async findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.departmentsService.findOne(id);
  }

  @Post()
  async create(@Body() department: CreateDepartmentDto){
    return this.departmentsService.create(department);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() department: CreateDepartmentDto,
  ){
    return this.departmentsService.update(id, department);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.departmentsService.delete(id);
  }
}
