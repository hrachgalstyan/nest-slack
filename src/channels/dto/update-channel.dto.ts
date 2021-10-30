import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateChannelDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name must be a string' })
  name: string;
}
