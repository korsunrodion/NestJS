import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShowtimeEntity } from './entity/showtime.entity';
import { DataSource, In, Repository } from 'typeorm';
import { ShowtimeSummaryEntity } from './entity/showtimeSummary.entity';
import { ShowtimeInterface } from 'src/scraper/interface/showtime.interface';

@Injectable()
export class ShowtimeService {
  private readonly logger = new Logger(ShowtimeService.name);

  constructor(
    @InjectRepository(ShowtimeEntity)
    private showtimeEntityRepository: Repository<ShowtimeEntity>,
    @InjectRepository(ShowtimeSummaryEntity)
    private showtimeSummaryEntityRepository: Repository<ShowtimeSummaryEntity>,
    private dataSource: DataSource,
  ) {}

  private async updateShowtimeSummary(showtimesIds: string[]) {
    if (showtimesIds.length === 0) {
      return;
    }

    await this.dataSource.query(`
        INSERT INTO "showtime-summary"
        ("showtimeDate",
         "cinemaName",
         "movieTitle",
         "attributes",
         "city",
         "showtimeCount")
        select date(showtime."showtimeInUTC" AT TIME ZONE 'UTC'),
            showtime."cinemaName",
            showtime."movieTitle",
            showtime.attributes,
            showtime.city,
            count(*)
        from "showtime"
        where showtime."showtimeId" IN (${showtimesIds.map((i) => `'${i}'`)})
        group by 1, 2, 3, 4, 5
        ON CONFLICT
            (
            "showtimeDate",
            "cinemaName",
            "movieTitle",
            "attributes",
            "city"
            )
            DO UPDATE
              SET "showtimeCount"= EXCLUDED."showtimeCount" + 1
    `);
  }

  async addOrReplaceShowtimes(showtimes: ShowtimeInterface[]) {
    try {
      const showtimeIds = showtimes.map((item) => item.showtimeId);
      const existingShowtimes = await this.dataSource
        .createQueryBuilder()
        .select("showtime.showtimeId")
        .from(ShowtimeEntity, 'showtime')
        .where({
          showtimeId: In(showtimeIds)
        })
        .getRawMany();
      const existingIds = existingShowtimes.map((item) => item.showtime_showtimeId);

      await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(ShowtimeEntity)
        .where({
          showtimeId: In(existingIds)
        })
        .execute();

      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(ShowtimeEntity)
        .values(showtimes)
        .execute();

      // presumes that same id means that cinemaName, movieTitle etc are the same
      const summaryUpdateIds = showtimeIds.filter((id) => !existingIds.includes(id));

      await this.updateShowtimeSummary(summaryUpdateIds);
    } catch (e) {
      this.logger.error(`Adding new showtimes failed with error: ${e}`)
    }
  }
}
