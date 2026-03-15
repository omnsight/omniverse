import React, { useState } from 'react';
import { ActionIcon, Stack, Popover } from '@mantine/core';

interface Props {
  children: React.ReactNode[];
  avatarOnOpen: React.ReactNode;
  avatarOnClose: React.ReactNode;
}

export const AvatarDropdown: React.FC<Props> = ({ children, avatarOnOpen, avatarOnClose }) => {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom"
      withArrow
      shadow="md"
      width={60}
      withinPortal
    >
      <Popover.Target>
        <ActionIcon
          variant="light"
          color="blue"
          size="lg"
          radius="xl"
          onClick={() => setOpened((o) => !o)}
        >
          {opened ? avatarOnOpen : avatarOnClose}
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown
        style={{
          padding: 5,
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
        }}
      >
        <Stack gap={8} style={{ backgroundColor: 'transparent', padding: 5 }}>
          {children}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};
