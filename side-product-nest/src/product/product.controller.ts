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
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  //ใช้ FileInterceptor: 'image' คือชื่อฟิลด์ของไฟล์
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', //ปลายทาง
        filename: editFileName, //ชื่อไฟล์
      }),
      fileFilter: (req,file,callback) => {
        if (!file.mimetype.startsWith('image/')) {
        // หากไม่ใช่รูปภาพ จะปฏิเสธไฟล์นั้น
        return callback(new BadRequestException('Only image files are allowed!'), false);
      }
      }
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    // ดักจับไฟล์ที่อัปโหลด
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required.');
    }
    try {
      const imageUrl: string = `/uploads/${file.filename}`; //สร้าง url
      //บันทึก DTO ที่มี URL แล้ว
      createProductDto.image = imageUrl;
      return this.productService.create(createProductDto);
    } catch (error) {
      console.error('Error in save/create:', error);
      throw new InternalServerErrorException('Failed to process/save product.');
    }
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
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
