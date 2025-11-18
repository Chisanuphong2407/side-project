import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UnitDocument = Unit & Document;

@Schema()
export class Unit {
  @Prop()
  unitname: string;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
