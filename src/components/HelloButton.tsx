import React from 'react';

type Props = { name: string; onClick?: () => void };

export default function HelloButton({ name, onClick }: Props) {
  return (
    <button aria-label="hello-btn" onClick={onClick}>
      Hello {name}
    </button>
  );
}
