import { ApiProperty } from "@nestjs/swagger";
import { ShowtimeInterface, ShowtimeInterfaceDto } from "./showtime.interface";

export interface WebsiteData {
  title: string;
  metaDescription: string;
  faviconUrl: string;
  scriptUrls: string[];
  stylesheetUrls: string[];
  imageUrls: string[];
  showtimes: ShowtimeInterface[];
}

export abstract class WebsiteDataDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  metaDescription: string;

  @ApiProperty()
  faviconUrl: string;

  @ApiProperty()
  scriptUrls: string[];

  @ApiProperty()
  stylesheetUrls: string[];

  @ApiProperty()
  imageUrls: string[];

  @ApiProperty({ type: ShowtimeInterfaceDto, isArray: true })
  showtimes: ShowtimeInterfaceDto[];
}