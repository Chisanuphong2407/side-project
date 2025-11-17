import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schema/product.schema';
import { productDocument } from './schema/product.schema';
import { Model } from 'mongoose';
import * as path from 'path'; // สำหรับจัดการ path
import * as fs from 'fs/promises'; // สำหรับบันทึกไฟล์

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<productDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const data = new this.productModel(createProductDto);
    return data.save();
  }

  async saveImage(file: Express.Multer.File): Promise<string> {
    const uploadDir = './uploads';
    await fs.mkdir(uploadDir, { recursive: true }); // สร้างโฟลเดอร์หากยังไม่มี
    const fileName = `${Date.now()}-${file.originalname} `; // ตั้งชื่อไฟล์
    const filePath = `${uploadDir}/${fileName}`;

    await fs.writeFile(filePath, file.buffer); // บันทึกไฟล์ลงดิสก์
    return `/uploads/${fileName}`;
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
