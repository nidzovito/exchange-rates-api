import { Currency } from 'utils/types'
import { API_BASE, fetchLiveData } from 'utils/ratesApi'

const mockApiResponse = { "success": true, "timestamp": 1675209600, "base": "USD", "date": "2023-02-03", "rates": { "BRL": 5.132504 } }

describe('fetchLiveDate() method', () => {
  const fetchSpy = jest.fn()
  global.fetch = fetchSpy

  afterEach(() => {
    fetchSpy.mockReset();
  })

  it('should call API with correct query params', async () => {
    fetchSpy.mockResolvedValue({ json: () => Promise.resolve(mockApiResponse) })
    await fetchLiveData({ base: Currency.USD, target: Currency.BRL })
    expect(fetchSpy).toHaveBeenCalledWith(`${API_BASE}/latest?access_key=&base=USD&symbols=BRL`)
  });

  it('should call throw error if response success is false', async () => {
    fetchSpy.mockResolvedValue({
      json: () => Promise.resolve({
        success: false,
        error: {
          info: 'buy it now'
        }
      })
    })
    expect(
      fetchLiveData({ base: Currency.USD, target: Currency.BRL })
    ).rejects.toThrow('buy it now')
  });

  it('should call throw error when network is down', async () => {
    fetchSpy.mockResolvedValue({
      json: () => Promise.reject(new Error('network issue'))
    })
    expect(fetchLiveData({ base: Currency.USD, target: Currency.BRL })).rejects.toThrow('network issue')
  });
});
