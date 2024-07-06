import { IsString } from 'class-validator';

export class AddMemberDto {
  @IsString()
  readonly userId: string;
}
