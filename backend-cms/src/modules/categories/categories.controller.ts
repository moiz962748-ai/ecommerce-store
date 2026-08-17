import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';


@Controller('categories')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ADMIN aur PARTNER categories create kar sakte hain
  @Post()
  @Roles('ADMIN', 'PARTNER')
  async createCategory(@Body() body: any) {
    return await this.categoriesService.createCategory(body);
  }

  // Saari categories ki list get karne ke liye
  @Get()
  @Roles('ADMIN', 'PARTNER', 'CUSTOMER')
  async getAllCategories() {
    return await this.categoriesService.getAllCategories();
  }

  // Category update karne ke liye
  @Patch(':id')
  @Roles('ADMIN', 'PARTNER')
  async updateCategory(@Param('id') id: string, @Body() body: any) {
    return await this.categoriesService.updateCategory(id, body);
  }

  @Delete(':id')
@Roles('ADMIN')
async deleteCategory(@Param('id') id: string) {
  return await this.categoriesService.deleteCategory(id);
}
}