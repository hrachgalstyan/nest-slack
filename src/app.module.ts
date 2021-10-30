import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceModule } from './workspace/workspace.module';
import { ChannelsModule } from './channels/channels.module';
import { UserModule } from './user/user.module';
import { typeOrmConfig } from './typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    WorkspaceModule,
    ChannelsModule,
    UserModule,
  ],
})
export class AppModule {}
