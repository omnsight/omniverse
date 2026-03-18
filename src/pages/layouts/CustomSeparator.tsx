import { Separator } from 'react-resizable-panels';
import { Box } from '@mantine/core';

interface Props {
  orientation: 'horizontal' | 'vertical';
}

export const CustomSeparator: React.FC<Props> = ({ orientation }) => {
  return (
    <Separator
      style={{
        backgroundColor: 'transparent',
        width: orientation === 'horizontal' ? '8px' : '100%',
        height: orientation === 'vertical' ? '8px' : '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: orientation === 'horizontal' ? 'col-resize' : 'row-resize',
      }}
    >
      {/* The visible line that appears on hover */}
      <Box
        style={{
          backgroundColor: 'var(--mantine-color-blue-filled)',
          borderRadius: 4,
          opacity: 0,
          transition: 'opacity 0.2s',
          width: orientation === 'horizontal' ? '2px' : '30%',
          height: orientation === 'vertical' ? '30%' : '2px',
          '[data-separator]:hover &': { opacity: 0.5 },
          '[data-separator][data-active] &': { opacity: 1 },
        }}
      />
    </Separator>
  );
};
