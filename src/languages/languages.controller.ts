import { Controller, Post, Body, Put, Param, Delete, Get } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { Language } from './language.entity';
import { get } from 'http';
import { CreateLanguageDto } from './dto/create-language.dto';

@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Get()
  async findAll(): Promise<Language[]> {
    return this.languagesService.findAll();
  }

  @Get(':code')
  async findOne(@Param('code') code: string): Promise<Language | null> {
    return this.languagesService.findOne(code);
  }   

  @Post()
  async create(@Body() language: CreateLanguageDto) {
    return this.languagesService.create(language);
  }

  @Put(':code')
  async update(
    @Param('code') code: string,
    @Body() language: { name: string },
  ): Promise<Language | { error: string }> {
    return this.languagesService.update(code, language);
  }

  @Delete(':code')
  async delete(@Param('code') code: string): Promise<{ message: string } | { error: string }> {
    return this.languagesService.delete(code);
  }
}
