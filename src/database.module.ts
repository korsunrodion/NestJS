import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ShowtimeEntity } from './showtime/entity/showtime.entity';
import { ShowtimeSummaryEntity } from './showtime/entity/showtimeSummary.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [ShowtimeEntity, ShowtimeSummaryEntity],
        synchronize: true,
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule {}