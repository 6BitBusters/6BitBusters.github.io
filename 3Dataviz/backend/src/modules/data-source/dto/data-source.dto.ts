export class DataSourceDto {
  id: number;
  name: string;
  size: [number, number];
  description: string;

  constructor(
    id: number,
    name: string,
    size: [number, number],
    description: string,
  ) {
    this.id = id;
    this.name = name;
    this.size = size;
    this.description = description;
  }
}
