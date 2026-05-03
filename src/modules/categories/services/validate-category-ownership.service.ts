import { Injectable, NotFoundException } from '@nestjs/common';

import { CategoriesRepository } from 'src/shared/database/repositories/categories.repositories';

@Injectable()
export class ValidateCategoryOwnerShipService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}

  async validate(userId: string, categoryId: string) {
    const exists = await this.categoriesRepo.count({
      where: { id: categoryId, userId },
    });

    if (exists === 0) {
      throw new NotFoundException('category not found.');
    }
  }
}
