import React from 'react';
import { Text, Box } from '@mantine/core';

interface NewBadgeProps {
  size?: number | string;
  top?: number | string;
  right?: number | string;
}

export const NewBadge: React.FC<NewBadgeProps> = ({ size = '0.5rem', top = -8, right = -8 }) => {
  const text = 'NEW!!!';
  const letters = text.split('');

  return (
    <>
      <style>
        {`
          @keyframes wave-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
        `}
      </style>
      <Box
        style={{
          position: 'absolute',
          top,
          right,
          zIndex: 10,
          pointerEvents: 'none',
          display: 'flex',
          gap: '1px',
        }}
      >
        {letters.map((letter, index) => (
          <Text
            key={index}
            component="span"
            c="#FFD700"
            fw={900}
            style={{
              fontSize: size,
              textShadow: '0px 1px 2px rgba(0,0,0,0.8)',
              animation: 'wave-bounce 1s infinite ease-in-out',
              animationDelay: `${index * 0.1}s`,
              display: 'inline-block',
            }}
          >
            {letter}
          </Text>
        ))}
      </Box>
    </>
  );
};
