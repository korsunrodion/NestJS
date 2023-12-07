import { Controller, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScraperRequestDto } from './dto/scraper-request.dto';
import { ScraperService } from './scraper.service';
import { ScraperResponseDto } from './dto/scraper-response.dto';

@Controller('scraper')
@ApiTags('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @ApiOperation({
    summary: 'Initiate a new scraping process for the provided URL',
  })
  @ApiOkResponse({
    description: 'Successfully parsed showtimes',
    type: ScraperResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Url not found'
  })
  @ApiBadRequestResponse({
    description: 'Url is not valid'
  })
  @ApiInternalServerErrorResponse({
    description: 'Url cannot be parsed'
  })
  @Get('scrape')
  scrapeRequest(
    @Query() scrapeRequestDto: ScraperRequestDto,
  ): Promise<ScraperResponseDto> {
    return this.scraperService.scrape(scrapeRequestDto.url);
  }
}
