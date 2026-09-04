import { IsISO8601, IsObject, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUsageEventDto {
  @IsString() @MinLength(8)
  eventId!: string;

  @IsString() @MinLength(1)
  organizationId!: string;

  @IsOptional() @IsString()
  projectId?: string;

  @IsString() @MinLength(1)
  meter!: string;

  @IsString()
  quantity!: string;

  @IsISO8601()
  timestamp!: string;

  @IsString()
  source!: string;

  @IsOptional() @IsObject()
  metadata?: Record<string, unknown>;
}
