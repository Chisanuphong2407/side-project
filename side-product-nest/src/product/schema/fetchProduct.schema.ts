import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FetchProductDocument = FetchProduct & Document;

@Schema()
export class FetchProduct {
  @Prop()
  productname: string;

  @Prop()
  catalog: string;

  @Prop()
  unit: string;

  @Prop({ required: true })
  ownerID: string;
}

export const fetchProductSchema = SchemaFactory.createForClass(FetchProduct);
