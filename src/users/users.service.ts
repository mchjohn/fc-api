import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { createHashPasswordasync } from 'src/utils/createHashPassword';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const emailTaken = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (emailTaken) {
      throw new ConflictException({ message: 'Este email já está em uso.' });
    }

    const hashedPassword = await createHashPasswordasync(password);

    const user = this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
