import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class VerifyStudentByNameDto {
    @ApiProperty({ description: "Student name", required: false })
    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    name: string;

    @ApiProperty({ description: "Student surname", required: false })
    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    surname: string;

    @ApiProperty({ description: "Student record book number", required: false })
    @IsNotEmpty()
    @MaxLength(50)
    @IsString()
    recordBookNumber: string;
}

export class VerifyStudentByPhoneNumberDto {
    @ApiProperty({ description: "Student phone number", required: true })
    @IsNotEmpty()
    @MaxLength(20)
    @IsString()
    phoneNumber: string;
}