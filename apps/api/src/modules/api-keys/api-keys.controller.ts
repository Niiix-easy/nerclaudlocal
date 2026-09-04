import { Body, Controller, Post } from "@nestjs/common";
import { IsArray, IsString } from "class-validator";
import { ApiKeysService } from "./api-keys.service";

class CreateApiKeyDto {
  @IsString() organizationId!: string;
  @IsString() projectId!: string;
  @IsString() userId!: string;
  @IsString() name!: string;
  @IsArray() scopes!: string[];
}

@Controller("api-keys")
export class ApiKeysController {
  constructor(private readonly service: ApiKeysService) {}
  @Post()
  create(@Body() dto: CreateApiKeyDto) {
    return this.service.create(dto.organizationId, dto.projectId, dto.userId, dto.name, dto.scopes);
  }
}
