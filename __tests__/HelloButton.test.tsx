import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HelloButton from '../src/components/HelloButton';

test('renders button and triggers click handler', async () => {
  const user = userEvent.setup();
  const handleClick = jest.fn();

  render(<HelloButton name="Vladi" onClick={handleClick} />);

  const btn = screen.getByRole('button', { name: /hello/i });
  expect(btn).toBeInTheDocument();
  expect(btn).toHaveTextContent('Hello Vladi');

  await user.click(btn);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
