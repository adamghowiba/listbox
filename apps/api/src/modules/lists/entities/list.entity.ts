import { ApiProperty } from '@nestjs/swagger';
import { List } from '@prisma/client';

export class ListEntity implements List {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  title!: string;

  @ApiProperty({ type: String, nullable: true })
  description!: string | null;

  @ApiProperty({ type: String })
  user_id!: string;

  @ApiProperty({ type: Date })
  created_at!: Date;

  @ApiProperty({ type: Date })
  updated_at!: Date;
}
