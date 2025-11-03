import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateListDto
  implements Omit<Prisma.ListUncheckedCreateInput, 'user_id'>
{
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  title!: string;

  @ApiProperty({ type: String, nullable: true })
  description!: string | null;
}
