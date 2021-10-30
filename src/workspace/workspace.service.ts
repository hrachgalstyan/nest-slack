import { Workspace } from './entities/workspace.entity';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspaceService {
  async create(
    createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<{ success: boolean; message: string }> {
    const { name } = createWorkspaceDto;

    const checkWorkspace = await Workspace.findOne({ name });

    if (checkWorkspace)
      throw new ForbiddenException('Workspace has already existed');

    const workspace = new Workspace();
    workspace.name = name;
    await workspace.save();

    return {
      success: true,
      message: 'Workspace created',
    };
  }

  async findOne(id: number): Promise<Workspace> {
    const workspace = await Workspace.findOne(id);

    if (!workspace) throw new NotFoundException('Workspace not found');

    return workspace;
  }

  async update(
    id: number,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<{ success: boolean; message: string }> {
    const { name } = updateWorkspaceDto;

    try {
      await Workspace.update({ id }, { name });

      return {
        success: true,
        message: `Workspace #${id} updated`,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    try {
      await Workspace.delete(id);

      return {
        success: true,
        message: `Workspace #${id} deleted`,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
