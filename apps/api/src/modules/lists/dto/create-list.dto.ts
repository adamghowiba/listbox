import { ApiProperty, OmitType } from '@nestjs/swagger';
import { FieldType, Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateListFieldDto
  implements Prisma.ListFieldUncheckedCreateInput
{
  @ApiProperty({ type: String })
  @IsString()
  name!: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  description?: string | null | undefined;

  @ApiProperty({ enum: FieldType })
  type!: FieldType;

  @ApiProperty({ type: Object, nullable: true })
  @IsOptional()
  field_config?:
    | Prisma.NullableJsonNullValueInput
    | Prisma.InputJsonValue
    | undefined;

  @ApiProperty({ type: String })
  @IsString()
  list_id!: string;
}

export class CreateListFieldWithoutListDto extends OmitType(
  CreateListFieldDto,
  ['list_id']
) {}

export class CreateListDto
  implements Omit<Prisma.ListUncheckedCreateInput, 'user_id' | 'fields'>
{
  @ApiProperty({ type: String })
  @IsString()
  title!: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  description!: string | null;

  @ApiProperty({ type: [CreateListFieldWithoutListDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateListFieldWithoutListDto)
  fields!: CreateListFieldWithoutListDto[];
}
