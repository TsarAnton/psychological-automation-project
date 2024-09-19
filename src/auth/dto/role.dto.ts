import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";

@ApiTags('Role')
export class CreateRoleDto {
    @ApiProperty({ description: "Created role name", required: true })
    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    name: string;
}

@ApiTags('Role')
export class UpdateRoleDto {
    @ApiProperty({ description: "Updated role name", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;
}

@ApiTags('Role')
export class ReadAllRolesDto extends BaseReadAllDto {
    @ApiProperty({ description: "Filter: role name", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;

    @ApiProperty({ description: "Filter: array of role ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    ids?: number[];
}

@ApiTags('Role')
export class ReadOneRoleDto {
    @ApiProperty({ description: "Filter: role name", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;

    @ApiProperty({ description: "Filter: role id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;
}