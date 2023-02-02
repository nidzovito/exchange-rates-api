export enum Currency {
  EUR = "EUR",
  USD = "USD",
  GBP = "GBP",
  BRL = "BRL",
}

export const CurrencyLabels = {
  [Currency.EUR]: 'Euro (EUR)',
  [Currency.USD]: 'US Dollar (USD)',
  [Currency.GBP]: 'Pound Sterling (GBP)',
  [Currency.BRL]: 'Brazilian Real (BRL)'
}

export enum DateRange {
  OneWeek = '1 Week',
  TwoWeeks = '2 Weeks',
}

export type TableDataType = {
  timestamp: number,
  rate: number,
}

export type GraphDataType = {
  date: string,
  rate: number,
}
