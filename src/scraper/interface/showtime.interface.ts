import { ApiProperty } from "@nestjs/swagger";

export interface ShowtimeInterface {
  showtimeId: string;
  cinemaName: string;
  movieTitle: string;
  showtimeInUTC: string;
  bookingLink: string;
  attributes: string[];
}

export class ShowtimeInterfaceDto {
  @ApiProperty()
  showtimeId: string;

  @ApiProperty()
  cinemaName: string;

  @ApiProperty()
  movieTitle: string;

  @ApiProperty()
  showtimeInUTC: string;

  @ApiProperty()
  bookingLink: string;

  @ApiProperty()
  attributes: string[];
}