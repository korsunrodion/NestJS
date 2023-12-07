import { Test, TestingModule } from '@nestjs/testing';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';
import { ScraperRequestDto } from './dto/scraper-request.dto';
import { plainToClass } from 'class-transformer';
import { ScraperResponseDto } from './dto/scraper-response.dto';
const mockData = require('./mockData/data.json');

describe('ScraperController', () => {
  let controller: ScraperController;
  let service: ScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScraperController],
      providers: [
        {
          provide: ScraperService,
          useValue: {
            scrape: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ScraperController>(ScraperController);
    service = module.get<ScraperService>(ScraperService);
  });

  it('Should return scraped data for a valid URL', async () => {
    const result: ScraperResponseDto = plainToClass(ScraperResponseDto, mockData);
    const requestDto = new ScraperRequestDto();
    requestDto.url = 'https://uae.voxcinemas.com/showtimes?c=al-hamra-mall-ras-al-khaimah&d=20231208';

    jest.spyOn(service, 'scrape').mockImplementation(async () => result);

    expect(await controller.scrapeRequest(requestDto)).toBe(result);
  });


});