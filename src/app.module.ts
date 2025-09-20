import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EmployeesModule } from './employees/employees.module';
import { LoggerService } from './logger/logger.service';
import { LoggerMiddleware } from './common/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [/* 
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data1.db',
      entities: [__dirname + '/users/*.entity{.ts,.js}'],
      synchronize: true,
    }), */
    
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123',
      database: 'nest2',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    EmployeesModule

  ],
  controllers: [AppController],
  providers: [AppService, LoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
