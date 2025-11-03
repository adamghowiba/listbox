import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { PrismaService } from '@harvest/api-service-database';
import { ListEntity } from './entities/list.entity';

@Injectable()
export class ListsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createListDto: CreateListDto): Promise<ListEntity> {
    const list = await this.prisma.list.create({
      data: {
        user_id: '',
        ...createListDto,
      },
    });

    return list;
  }

  async list(): Promise<ListEntity[]> {
    const lists = await this.prisma.list.findMany();

    return lists;
  }

  async retrieve(id: string): Promise<ListEntity> {
    const list = await this.prisma.list.findUniqueOrThrow({
      where: { id: id },
    });

    return list;
  }

  async update(id: string, updateListDto: UpdateListDto): Promise<ListEntity> {
    const list = await this.prisma.list.update({
      where: {
        id,
      },
      data: {
        ...updateListDto,
      },
    });

    return list;
  }

  async remove(id: string): Promise<ListEntity> {
    const deletedList = await this.prisma.list.delete({
      where: { id },
    });

    return deletedList;
  }
}
