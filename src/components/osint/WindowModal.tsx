import React from 'react';
import { Modal, Box, Breadcrumbs, Anchor, ActionIcon, Group, Text, useMantineTheme, rem, LoadingOverlay, Tooltip } from '@mantine/core';
import { XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

export interface WindowBreadcrumb {
  label: string;
  onClick?: () => void;
}

interface WindowModalProps {
  opened: boolean;
  onClose: () => void;
  isLoading?: boolean;
  breadcrumbs: WindowBreadcrumb[];
  children: React.ReactNode;
  onBack?: () => void;
}

export const WindowModal: React.FC<WindowModalProps> = ({
  opened,
  onClose,
  isLoading = false,
  breadcrumbs,
  children,
  onBack
}) => {
  const theme = useMantineTheme();
  const showBackButton = !!onBack;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="40%"
      padding={0}
      withCloseButton={false}
      withinPortal={true}
      centered
      styles={{
        content: { height: '50%' },
        body: { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <LoadingOverlay visible={isLoading} overlayProps={{ radius: "sm", blur: 2 }} />
      {/* 1. STICKY HEADER */}
      <Box p="md" style={{ borderBottom: `1px solid ${theme.colors.gray[2]}` }}>
        <Group justify="space-between" mb={5}>
          <Breadcrumbs separator=">" style={{ flexWrap: 'nowrap' }}>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;

              if (isLast) {
                return (
                  <Tooltip key={index} label={item.label} openDelay={500} withArrow>
                    <Text size="md" c="dimmed" truncate="end" maw={200}>
                      {item.label}
                    </Text>
                  </Tooltip>
                );
              }

              return (
                <Tooltip key={index} label={item.label} openDelay={500} withArrow>
                  <Anchor
                    component="button"
                    size="md"
                    onClick={item.onClick}
                    truncate="end"
                    maw={200}
                  >
                    {item.label}
                  </Anchor>
                </Tooltip>
              );
            })}
          </Breadcrumbs>

          <Group gap="xs">
            {showBackButton && (
              <ActionIcon onClick={onBack} variant="light">
                <ArrowLeftIcon style={{ width: rem(20), height: rem(20) }} />
              </ActionIcon>
            )}
            <ActionIcon onClick={onClose} variant="subtle" color="red">
              <XMarkIcon style={{ width: rem(20), height: rem(20) }} />
            </ActionIcon>
          </Group>
        </Group>
      </Box>

      {/* 2. BODY CONTENT */}
      <Box style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {children}
      </Box>
    </Modal>
  );
};
