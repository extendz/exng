export class UnitOfMeasurement {
  code: string;
  description?: string;
}

export class Unit {
  value: number;
  unitOfMeasure: UnitOfMeasurement;
}
