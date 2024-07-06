import { IsOptional, IsString } from 'class-validator';

export class CreateOrgDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;
}
