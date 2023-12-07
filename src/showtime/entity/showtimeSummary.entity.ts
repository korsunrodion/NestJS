import { Entity, Column, PrimaryGeneratedColumn, Unique, Index } from 'typeorm';

@Entity({ name: 'showtime-summary', orderBy: { showtime_date: 'ASC' } })
@Unique(['showtimeDate', 'cinemaName', 'movieTitle', 'attributes', 'city'])
export class ShowtimeSummaryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  showtimeDate: Date;

  @Column({ nullable: false })
  cinemaName: string;

  @Column({ nullable: false })
  movieTitle: string;

  @Column('varchar', { array: true, nullable: false, default: [] })
  attributes: string[];
1
  @Column({ nullable: false, default: 'N/A' })
  city: string;

  @Column({ type: 'int', nullable: false })
  showtimeCount: number;
}
