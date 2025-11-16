import { ApiProperty } from '@nestjs/swagger';
import { Item } from '@prisma/client';
import type { JsonValue } from '@prisma/client/runtime/library';

export class ItemEntity implements Item {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String, description: 'The name of the item' })
  name!: string;

  @ApiProperty({ type: Number, nullable: true })
  rating!: number | null;

  @ApiProperty({ type: String, nullable: true })
  description!: string | null;

  @ApiProperty({ type: Object })
  properties!: JsonValue;

  @ApiProperty({ type: String })
  list_id!: string;

  @ApiProperty({ type: Date })
  created_at!: Date;

  @ApiProperty({ type: Date })
  updated_at!: Date;
}
