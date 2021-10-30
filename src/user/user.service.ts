import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcryptjs';
import * as randomstring from 'randomstring';

@Injectable()
export class UserService {
  constructor(private jwtService: JwtService) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ success: boolean; token: string }> {
    const { name, email, password, passwordConfirm } = createUserDto;

    if (password !== passwordConfirm)
      throw new ConflictException('Passwords do not match 😔');

    const checkUser = await User.findOne({ name, email });

    if (checkUser) throw new ForbiddenException('User has already existed');

    const user = new User();
    user.name = name;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    await user.save();

    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    return {
      success: true,
      token,
    };
  }

  async checkName(
    updateUserDto: UpdateUserDto,
  ): Promise<{ success: boolean; name?: string }> {
    const { name } = updateUserDto;

    const user = await User.findOne({ name });

    if (user) {
      const newName = `${name}${randomstring.generate({
        length: 3,
        charset: 'numeric',
      })}`;

      if (await this.checkName({ name: newName }))
        return { success: false, name: newName };
    } else {
      return { success: true };
    }
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ success: boolean; token: string }> {
    const { email, password } = loginUserDto;

    const user = await User.findOne(
      { email },
      {
        select: ['id', 'username', 'email', 'password', 'salt'],
      },
    );

    if (!user) throw new NotFoundException('User not found');

    if (await user.validatePassword(password)) {
      const token = this.jwtService.sign({
        id: user.id,
        username: user.username,
        email: user.email,
      });

      return {
        success: true,
        token,
      };
    } else {
      throw new ConflictException('Incorrect password');
    }
  }

  async findOne(id: number): Promise<User> {
    const user = await User.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ success: boolean; message: string }> {
    const { name } = updateUserDto;

    try {
      await User.update({ id }, { name });

      return {
        success: true,
        message: `User #${id} updated`,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async uploadFile(
    user: JwtPayload,
    file: Express.Multer.File,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await User.update(user.id, {
        image: `/${file.filename}`,
      });

      return {
        success: true,
        message: `User image has successfully uploaded`,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    try {
      await User.delete(id);

      return {
        success: true,
        message: `User #${id} deleted`,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
