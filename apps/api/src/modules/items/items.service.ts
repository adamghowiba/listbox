import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from '@harvest/api-service-database';
import { ListItemsDto } from './dto/get-items.dto';
import { ListField, Prisma } from '@prisma/client';

export type TextFieldConfig = {
  version: '1';
  type: 'text';
  minLength?: number;
  maxLength?: number;
};

export type NumberFieldConfig = {
  version: '1';
  type: 'number';
  minValue?: number;
  maxValue?: number;
};

export type BooleanFieldConfig = {
  version: '1';
  type: 'boolean';
};

export type DateFieldConfig = {
  version: '1';
  type: 'date';
  minDate?: string;
  maxDate?: string;
};

export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | BooleanFieldConfig;

type FieldTypeValidationResult =
  | {
      valid: true;
    }
  | { valid: false; errorMessage: string };

@Injectable()
export class PropertiesValidatorService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Validates item properties against the list's field definitions.
   * This is a placeholder for future implementation.
   */
  async validateItemProperties(params: {
    listId: string;
    properties: Prisma.JsonValue;
  }) {
    const { listId, properties } = params;

    const fields = await this.prisma.listField.findMany({
      where: {
        id: params.listId,
      },
    });

    const fieldMap = new Map<string, ListField>(
      fields.map((field) => [field.name, field])
    );

    if (typeof properties !== 'object' || properties === null) {
      throw new Error('Item properties must be a valid JSON object.');
    }

    /**
     * TODO LIST:
     * - Handle custom field config (e.g required, min/max, select options, etc. )
     * -
     */
    const fieldErrors = Object.entries(properties).reduce(
      (
        acc: { field: string; errorMessage: string }[],
        [key, value]: [string, any]
      ) => {
        const field = fieldMap.get(key);
        const fieldType = field?.type;
        const doesPropertyExist = fieldMap.has(key);

        if (typeof field !== 'object') return acc;

        if (!doesPropertyExist) {
          acc.push({
            field: field.name,
            errorMessage: `Field ${field.name} is missing in item properties.`,
          });
        }

        if (fieldType === 'NUMBER') {
          const validation = this.validateNumberField(value);

          if (!validation.valid)
            acc.push({
              field: field.name,
              errorMessage: validation.errorMessage,
            });
        }

        return acc;
      },
      []
    );

    if (fieldErrors.length > 0) {
      return {
        valid: false,
        errors: fieldErrors,
      };
    }

    return {
      valid: true,
    };
  }

  validateNumberField(params: {
    fieldConfig: FieldConfig;
    value: any;
  }): FieldTypeValidationResult {
    const { fieldConfig, value } = params;

    if (fieldConfig.type !== 'number') {
      return { valid: false, errorMessage: 'Field config type is not number.' };
    }

    if (typeof value !== 'number') {
      return { valid: false, errorMessage: 'Value is not a number.' };
    }

    if (fieldConfig.minValue !== undefined && value < fieldConfig.minValue) {
      return {
        valid: false,
        errorMessage: `Value is less than minimum value of ${fieldConfig.minValue}.`,
      };
    }

    if (fieldConfig.maxValue !== undefined && value > fieldConfig.maxValue) {
      return {
        valid: false,
        errorMessage: `Value is greater than maximum value of ${fieldConfig.maxValue}.`,
      };
    }

    return { valid: true };
  }
}

@Injectable()
export class ItemsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly propertiesValidator: PropertiesValidatorService
  ) {}

  async create(createItemDto: CreateItemDto) {
    const propertyValidation =
      await this.propertiesValidator.validateItemProperties({
        listId: createItemDto.list_id,
        properties: createItemDto.properties,
      });

    if (!propertyValidation.valid) {
      throw new Error(
        `Item properties validation failed: ${JSON.stringify(
          propertyValidation.errors
        )}`
      );
    }

    const item = await this.prisma.item.create({
      data: {
        ...createItemDto,
      },
    });

    return item;
  }

  async list(listItemsDto: ListItemsDto) {
    const propertiesFilter: Prisma.JsonFilter<'Item'> = {};

    const item = await this.prisma.item.findMany({
      where: {
        list_id: listItemsDto.list_id,
        properties: listItemsDto.field_filters,
      },
    });

    return item;
  }

  async retrieve(id: string) {
    const item = await this.prisma.list.findUnique({
      where: { id },
    });

    return item;
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    const item = await this.prisma.item.update({
      where: { id },
      data: {
        ...updateItemDto,
      },
    });

    return item;
  }

  async remove(id: string) {
    const item = await this.prisma.item.delete({
      where: { id },
    });

    return item;
  }
}
