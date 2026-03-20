import { Separator } from 'react-resizable-panels';
import { Box } from '@mantine/core';

interface Props {
  orientation: 'horizontal' | 'vertical';
}

export const CustomSeparator: React.FC<Props> = ({ orientation }) => {
  return (
    <Separator
      style={{
        backgroundColor: 'var(--mantine-color-default-border)',
        width: orientation === 'horizontal' ? '2px' : '100%',
        height: orientation === 'vertical' ? '2px' : '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: orientation === 'horizontal' ? 'col-resize' : 'row-resize',
      }}
    >
      {/* The visible line that appears on hover */}
      <Box
        style={{
          backgroundColor: 'var(--mantine-color-primary-filled)',
          borderRadius: 1,
          opacity: 0,
          transition: 'opacity 0.2s',
          width: orientation === 'horizontal' ? '1px' : '30%',
          height: orientation === 'vertical' ? '30%' : '1px',
          '[dataSeparator]:hover &': { opacity: 0.5 },
          '[dataSeparator][dataActive] &': { opacity: 1 },
        }}
      />
    </Separator>
  );
};
