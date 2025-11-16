import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNumber, IsObject, IsOptional, IsString, Max } from 'class-validator';

export class CreateItemDto implements Prisma.ItemUncheckedCreateInput {
  @ApiProperty({ type: String })
  @IsString()
  name!: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  @Max(10)
  rating?: number | null | undefined;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  description?: string | null | undefined;

  @ApiProperty({ type: Object })
  @IsOptional()
  @IsObject()
  properties?: Prisma.NullTypes.JsonNull | Prisma.InputJsonValue | undefined;

  @ApiProperty({ type: String })
  @IsString()
  list_id!: string;
}
