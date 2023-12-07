import { ApiProperty } from '@nestjs/swagger';
import { WebsiteDataDto } from '../interface/website-data.interface';

export class ScraperResponseDto {
  @ApiProperty({
    description: 'Requested url',
    example: 'https://uae.voxcinemas.com/showtimes?c=al-hamra-mall-ras-al-khaimah&d=20231208'
  })
  requestUrl: string;

  @ApiProperty({
    description: 'Parsing response object',
    example: {
      title: 'Movie Timings at Al Hamra Mall - Ras Al Khaimah Cinema | VOX Cinemas UAE',
      metaDescription: 'Looking for new movies to watch at Al Hamra Mall - Ras Al Khaimah cinema? We\'ve got you covered! Visit our website to see movies showtimes, trailers & more.',
      faviconUrl: '/assets/favicon.ico',
      scriptsUrls: ['https://cdn.cookielaw.org/consent/875eb283-28ea-45f1-b220-2282bbb56c28/OtAutoBlock.js'],
      stylesheetsUrls: ['/assets/css/core-1dbab51d41ea88ce70ae1a02a9f2dd14.css'],
      imageUrls: ['/assets/images/region/ae-128x128.png'],
      showtimes: [{
        showtimeId: "0009-172105",
        cinemaName: "Al Hamra Mall - Ras Al Khaimah",
        movieTitle: "Animal",
        showtimeInUTC: "2023-12-08T10:00:00.000Z",
        bookingLink: "https://uae.voxcinemas.com/booking/0009-172105",
        attributes: [
            "VIP"
        ],
        id: 1003,
        createdAt: "2023-12-07T10:39:32.496Z",
        updatedAt: "2023-12-07T10:39:32.496Z",
        city: "N/A"
      }]
    },
    type: WebsiteDataDto
  })
  responseData: WebsiteDataDto;
}
