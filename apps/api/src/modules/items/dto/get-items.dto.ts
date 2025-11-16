import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export type FieldFilter = Record<string, any>;

export class ListItemsDto {
  @ApiProperty({ type: String })
  @IsString()
  list_id!: string;

  @ApiProperty({ type: Object, required: false })
  field_filters?: FieldFilter;
}
