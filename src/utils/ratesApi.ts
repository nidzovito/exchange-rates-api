import dayjs from "dayjs";

import { Currency, DateRange, TableDataType, GraphDataType } from 'utils/types'
import { uuid } from 'utils/helpers';

export const API_BASE = 'https://api.exchangeratesapi.io'
const API_KEY = process.env.REACT_APP_API_KEY || ''
const DATE_FORMAT = 'YYYY-MM-DD'

export const fetchLiveData = async ({ target, base }: { target: Currency, base: Currency }): Promise<TableDataType> => {
  try {
    const queryParams: Record<string, string> = {
      access_key: API_KEY,
      base,
      symbols: target,
    }
    const response = await fetch(`${API_BASE}/latest?${new URLSearchParams(queryParams).toString()}`)
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error.info)
    }
    return {
      id: uuid(),
      timestamp: data.timestamp * 1000,
      rate: data.rates[target]
    };
  } catch (err) {
    throw err;
  }
}

export const fetchHistoryData = async ({ target, base, range }: { target: Currency, base: Currency, range: DateRange }): Promise<GraphDataType[]> => {
  try {
    const queryParams: Record<string, string> = {
      access_key: API_KEY,
      base,
      symbols: target,
    }

    const numberOfDays = range === DateRange.OneWeek ? 7 : 14
    const result: GraphDataType[] = [];

    for (let i = 0; i < numberOfDays; i++) {
      const date = dayjs().subtract(i, 'day').format(DATE_FORMAT)
      const response = await fetch(`${API_BASE}/${date}?${new URLSearchParams(queryParams).toString()}`)
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error.info)
      }
      result.push({
        id: uuid(),
        date,
        rate: data.rates[target],
      })
    }

    return result.sort((a, b) => a.date < b.date ? -1 : 1)
  } catch (err) {
    throw err;
  }
}
