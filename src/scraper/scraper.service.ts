import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ScraperResponseDto } from './dto/scraper-response.dto';
import * as cheerio from 'cheerio';
import { WebsiteData } from './interface/website-data.interface';
import { ShowtimeService } from '../showtime/showtime.service';
import moment, { Moment } from 'moment-timezone';
import { ShowtimeInterface } from './interface/showtime.interface';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly showtimeService: ShowtimeService,
  ) {}

  private async fetchHtml(ur: string): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get<string>(ur).pipe(
        catchError((error: AxiosError) => {
          const msg = error?.response?.data || error?.response || error;
          this.logger.error(msg);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }

  private parseHtml(html: string, date: Moment): WebsiteData {
    const $ = cheerio.load(html);
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') ?? '';
    const faviconUrl = $('link[rel="shortcut icon"]').attr('href') ?? '';

    const scriptUrls: string[] = [];
    $('script').each((_i, el) => {
      const src = $(el).attr('src');
      if (src) {
        scriptUrls.push(src);
      }
    });

    const stylesheetUrls: string[] = [];
    $('link[rel="stylesheet"]').each((_i, el) => {
      const href = $(el).attr('href');
      if (href) {
        stylesheetUrls.push(href);
      }
    });

    const imageUrls: string[] = [];
    $('img').each((_i, el) => {
      const src = $(el).attr('src');
      if (src) {
        imageUrls.push(src);
      }
    });

    const showtimes: ShowtimeInterface[] = [];

    try {
      $('article.movie-compare').each(function() {
        const movieTitle = $(this).find('aside.movie-hero h2').text();
        const cinemaName = $(this).find('h3.highlight').text();

        $(this).find('ol.showtimes li').each(function () {
          const category = $(this).find('strong').text();

          $(this).find('ol li').each(function () {
            const bookingHref = $(this).find('a').attr('href');
            const showtimeId = bookingHref.split('/')[2];
            const bookingTime = $(this).find('a').text().replace('3D', '');
            const dateStr = date.format('YYYY-MM-DD');
            const showtimeInUTC = moment(`${dateStr} ${bookingTime}`, 'YYYY-MM-DD hh:mmA').toISOString()

            showtimes.push({
              showtimeId,
              cinemaName,
              movieTitle,
              showtimeInUTC,
              bookingLink: `https://uae.voxcinemas.com${bookingHref}`,
              attributes: [category]
            })
          })
        })
      });
    } catch (e) {
      this.logger.error(`Error parsing showtimes: ${e}`);
    }

    return {
      title,
      metaDescription,
      faviconUrl,
      scriptUrls,
      stylesheetUrls,
      imageUrls,
      showtimes,
    };
  }

  private getDateFromURL(url: string) {
    const dateMatch = url.match(/d=(\d{8})/);
    const dateStr = dateMatch ? dateMatch[1] : moment().format('YYYYMMDD');
    return moment(dateStr);
  }

  async scrape(url: string): Promise<ScraperResponseDto> {
    const html = await this.fetchHtml(url);
    const date = this.getDateFromURL(url);
    const websiteData: WebsiteData = this.parseHtml(html, date);
    await this.showtimeService.addOrReplaceShowtimes(websiteData.showtimes);
    return {
      requestUrl: url,
      responseData: websiteData,
    };
  }
}
