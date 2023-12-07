import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class ScraperRequestDto {
  @ApiProperty({
    description: 'Website Url',
    required: true,
    example: 'https://www.cinemaplus.az/az/cinema/about-cinemaplus/28-mall/',
  })
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true
  })
  url: string;
}
