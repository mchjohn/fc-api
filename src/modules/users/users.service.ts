import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { createHashPasswordasync } from 'src/utils/createHashPassword';
import { PrismaService } from 'src/shared/database/prisma.service';

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
        categories: {
          createMany: {
            data: [
              // Income
              { name: 'Salário', icon: 'travel', type: 'INCOME' },
              { name: 'Freelance', icon: 'laptop', type: 'INCOME' },
              { name: 'Investimentos', icon: 'trending-up', type: 'INCOME' },
              { name: 'Venda', icon: 'shopping-bag', type: 'INCOME' },

              // Expense
              { name: 'Casa', icon: 'home', type: 'EXPENSE' },
              { name: 'Alimentação', icon: 'coffee', type: 'EXPENSE' },
              { name: 'Transporte', icon: 'car', type: 'EXPENSE' },
              { name: 'Lazer', icon: 'smile', type: 'EXPENSE' },
              { name: 'Saúde', icon: 'activity', type: 'EXPENSE' },
              { name: 'Educação', icon: 'book', type: 'EXPENSE' },
            ],
          },
        },
      },
    });
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
