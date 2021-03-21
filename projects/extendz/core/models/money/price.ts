export class Currency {
  code: string;
  name?: string;
}
export class Price {
  value: number;
  currency: Currency;
}
