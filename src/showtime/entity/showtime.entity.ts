import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Index(['city', 'cinemaName', 'movieTitle'])
@Index(['city', 'cinemaName'])
@Entity({ name: 'showtime', orderBy: { id: 'ASC' } })
// Indexes are set as if the functionality is similar to https://uae.voxcinemas.com/showtimes
export class ShowtimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Index()
  @Column({ nullable: false, unique: true })
  showtimeId: string;

  @Index()
  @Column({ nullable: false })
  cinemaName: string;

  @Index()
  @Column({ nullable: false })
  movieTitle: string;

  @Index()
  @Column({ type: 'timestamptz', nullable: false })
  showtimeInUTC: Date;

  @Column({ nullable: false })
  bookingLink: string;

  @Column('varchar', { array: true, nullable: false, default: [] })
  attributes: string[];

  @Index()
  @Column({ nullable: false, default: 'N/A' })
  city: string;
}
