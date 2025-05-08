import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty({ message: '태그 이름은 필수입니다' })
  @IsString({ message: '태그 이름은 문자열이어야 합니다' })
  @MaxLength(10, { message: '태그 이름은 10자를 초과할 수 없습니다' })
  name: string;
}