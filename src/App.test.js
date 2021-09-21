import {fireEvent, render, screen} from '@testing-library/react';
import App from './App';

test('renders made by alchemistsq link', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('menu'))
  const mistElement = screen.getByText(/made by certified alchemists/i);
  expect(mistElement).toBeInTheDocument();
});
