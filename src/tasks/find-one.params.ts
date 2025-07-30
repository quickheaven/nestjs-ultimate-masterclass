import { IsNotEmpty, IsString } from "class-validator";

export class FindOneParams {
    
  @IsNotEmpty()
  @IsString()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
