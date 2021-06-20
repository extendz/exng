export class Country {
  code: string;
  phoneCode?: string;
  name?: string;
}

export class Phone {
  number: string;
  country: Country;
}
