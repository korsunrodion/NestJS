import { Module } from '@nestjs/common';
import { ScraperModule } from './scraper/scraper.module';
import { ShowtimeModule } from './showtime/showtime.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    ScraperModule,
    ShowtimeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
