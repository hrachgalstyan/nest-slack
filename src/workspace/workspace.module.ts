import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { JwtStrategy } from '../user/jwt.strategy';
import { Workspace } from './entities/workspace.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, JwtStrategy],
})
export class WorkspaceModule {}
