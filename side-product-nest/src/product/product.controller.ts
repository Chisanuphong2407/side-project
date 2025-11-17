import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  //ใช้ FileInterceptor: 'image' คือชื่อฟิลด์ของไฟล์
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() createProductDto: CreateProductDto,
    // ดักจับไฟล์ที่อัปโหลด
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const logger = new Logger('controller');
      try {
        const imageUrl: string = await this.productService.saveImage(file);
        createProductDto.image = imageUrl;
        logger.log(createProductDto)
      } catch (error) {
        throw new BadRequestException("image error")
      }
    } else {
      throw new BadRequestException('Image file is required.');
    }
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
