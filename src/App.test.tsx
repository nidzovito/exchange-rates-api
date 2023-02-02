import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders layout properly', () => {
  render(<App />);
  expect(screen.getByText(/currency converter/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'https://exchangeratesapi.io' })).toBeInTheDocument();
});
