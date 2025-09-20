import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { AuthGuard } from '../common/auth.guard';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('protected')
  getProtected() {
    return 'This route is protected!';
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.employeesService.findOne(id);
  }

  @Post()
  create(@Body() employee: CreateEmployeeDto) {
    return this.employeesService.create(employee);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() employee: CreateEmployeeDto) {
    return this.employeesService.update(id, employee);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.employeesService.remove(id);
  }
}
