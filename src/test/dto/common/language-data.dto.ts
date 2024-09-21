import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

@ApiTags('Language')
export class LanguageNameDto {
    @ApiProperty({ description: "Language id for which name is given", required: true })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    language: number;

    @ApiProperty({ description: "Name of this entity on this language", required: true })
    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    name: string;
}

ApiTags('Language')
export class LanguageNameDescriptionDto {
    @ApiProperty({ description: "Language id for which name and description is given", required: true })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    language: number;

    @ApiProperty({ description: "Name of this entity on this language", required: true })
    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    name: string;

    @ApiProperty({ description: "Description of this entity on this language", required: true })
    @IsOptional()
    @IsString()
    description?: string;
}