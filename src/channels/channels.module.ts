import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { JwtStrategy } from '../user/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Channel } from './entities/channel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService, JwtStrategy],
})
export class ChannelsModule {}
