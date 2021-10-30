import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelsService {
  async create(
    createChannelDto: CreateChannelDto,
  ): Promise<{ success: boolean; message: string }> {
    const { name } = createChannelDto;

    const checkChannel = await Channel.findOne({ name });

    if (checkChannel)
      throw new ForbiddenException('Channel has already existed');

    const channel = new Channel();
    channel.name = name;
    await channel.save();

    return {
      success: true,
      message: 'Channel created',
    };
  }

  async findOne(id: number): Promise<Channel> {
    const channel = await Channel.findOne(id);

    if (!channel) throw new NotFoundException('Channel not found');

    return channel;
  }

  async update(
    id: number,
    updateChannelDto: UpdateChannelDto,
  ): Promise<{ success: boolean; message: string }> {
    const { name } = updateChannelDto;

    try {
      await Channel.update({ id }, { name });

      return {
        success: true,
        message: `Channel #${id} updated`,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    try {
      await Channel.delete(id);

      return {
        success: true,
        message: `Channel #${id} deleted`,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
