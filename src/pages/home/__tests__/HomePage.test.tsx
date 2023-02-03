import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { uuid } from 'utils/helpers';
import * as api from 'utils/ratesApi';
import HomePage from 'pages/home/HomePage';

jest.useFakeTimers();

const renderComponent = () => {
  render(<HomePage />);

  return {
    targetSelector: screen.getAllByRole('combobox')[0], // it's tricky to getByRole('combobox', { name: 'Target Currency' }) for Ant Design
    baseSelector: screen.getAllByRole('combobox')[1],
    intervalInput: screen.getByRole('spinbutton')
  };
};

describe('<HomePage> tests', () => {
  jest.spyOn(api, 'fetchHistoryData').mockResolvedValue([]);
  const fetchLiveDataSpy = jest.spyOn(api, 'fetchLiveData');

  beforeEach(() => {
    fetchLiveDataSpy.mockReset();
    fetchLiveDataSpy.mockResolvedValue({ id: uuid(), timestamp: new Date().valueOf(), rate: 5.5 });
  });

  const waitUntilDataReady = async (rowCount?: number) => {
    await waitFor(() => {
      expect(document.querySelectorAll('.ant-table-row').length).toBe(rowCount || 1);
    });
  };

  it('should call api every hour', async () => {
    const { intervalInput } = renderComponent();
    await waitUntilDataReady();
    expect(fetchLiveDataSpy).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(120 * 60 * 1000); // time travel for 2 hours
    await waitFor(() => {
      expect(fetchLiveDataSpy).toHaveBeenCalledTimes(3);
    });
    await waitUntilDataReady(3);
  });

  it('should render filters properly on initial render', async () => {
    const { baseSelector, targetSelector, intervalInput } = renderComponent();
    expect(baseSelector).toBeInTheDocument();
    expect(targetSelector).toBeInTheDocument();
    expect(intervalInput).toBeInTheDocument();
    await waitUntilDataReady();
    expect(fetchLiveDataSpy).toHaveBeenCalled();
  });

  it('should call api with default currency filters after initial render', async () => {
    renderComponent();
    await waitUntilDataReady();
    expect(fetchLiveDataSpy).toHaveBeenCalledTimes(1);
    expect(fetchLiveDataSpy).toHaveBeenCalledWith({ base: 'USD', target: 'BRL' });
  });

  it('should call api with new currencies after changing filter', async () => {
    const { targetSelector } = renderComponent();
    await waitUntilDataReady();
    expect(fetchLiveDataSpy).toHaveBeenCalledTimes(1);

    await userEvent.click(targetSelector);
    await userEvent.click(screen.getByTitle('Euro (EUR)'));
    await waitUntilDataReady();
    expect(fetchLiveDataSpy).toHaveBeenCalledTimes(2);
    expect(fetchLiveDataSpy).toHaveBeenCalledWith({ base: 'USD', target: 'EUR' });
  });

  it('should call api again after changing refresh interval', async () => {
    const { intervalInput } = renderComponent();
    await waitUntilDataReady();
    expect(fetchLiveDataSpy).toHaveBeenCalledTimes(1);

    await userEvent.type(intervalInput, '5');
    await waitUntilDataReady();
    expect(fetchLiveDataSpy).toHaveBeenCalledTimes(2);
  });
});
