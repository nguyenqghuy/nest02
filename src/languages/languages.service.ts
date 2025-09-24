import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './language.entity';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LanguagesService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async findAll(): Promise<Language[]> {
    return this.languageRepository.find();
  }

  async findOne(code: string): Promise<Language | null> {
    return this.languageRepository.findOneBy({ code });
  }

  async create(language: { code: string; name: string }): Promise<Language | { message: string }> {
    const existingLanguage = await this.languageRepository.findOneBy({ code: language.code });
    if (existingLanguage) {
      return { message: 'language code already exists' };
    }

    const newLanguage = this.languageRepository.create(language);
    this.logger.log(`Language ${language.code} created.`);
    return this.languageRepository.save(newLanguage);
  }

  async update(code: string, language: { name: string }): Promise<Language | { error: string }> {
    const existing = await this.languageRepository.findOneBy({ code });
    if (!existing) {
      return { error: 'Language not found' };
    }
    //Object.assign(existing, language);
    if (language.name) {
        existing.name = language.name;
        this.logger.log(`Language ${code} updated.`);
        return this.languageRepository.save(existing);
    }
    return {error: 'No valid fields to update'}
  }

  async delete(code: string): Promise<{ message: string } | { error: string }> {
    
    try{
        const result = await this.languageRepository.delete({ code });
    } catch (error) {
        return { error: 'Cannot delete language, it may be in use.' };
    }
  
    this.logger.log(`Language ${code} deleted.`);
    return { message: `Language ${code} deleted.` };
  }
}
