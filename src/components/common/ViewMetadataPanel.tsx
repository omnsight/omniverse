import React, { useState } from 'react';
import { Box, Paper, Group, ActionIcon, Collapse, Text, ScrollArea, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import {
  CameraIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/solid';
import {
  useViewMetadataStore,
  useViewMetadataActions,
  type EntityViewType,
  type ViewMetadataItem,
} from '../../store/viewMetadata';
import { EditableText } from '../entity/common/EditableText';
import { notifications } from '@mantine/notifications';

interface Props {
  viewType: EntityViewType;
}

export const ViewMetadataPanel: React.FC<Props> = ({ viewType }) => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(true);
  const [selectedViewId, setSelectedViewId] = useState<string | null>(null);

  const allViews = useViewMetadataStore((state) => state.views);
  const activeViewId = useViewMetadataStore((state) => state.activeViewId);
  const views = allViews.filter((v) => v.viewType === viewType);
  const {
    addView,
    removeView,
    updateViewName,
    restoreView: restoreViewAction,
  } = useViewMetadataActions();

  const handleSnapshot = () => {
    try {
      addView(
        t('components.viewMetadata.viewName', {
          count: views.length + 1,
          defaultValue: `View ${views.length + 1}`,
        }),
        viewType,
      );
    } catch (error) {
      notifications.show({
        title: t('common.error', { defaultValue: 'Error' }),
        message: t('components.viewMetadata.duplicateView', {
          defaultValue: 'View already exists',
        }),
        color: 'red',
      });
    }
  };

  const restoreView = (view: ViewMetadataItem) => {
    restoreViewAction(view);
    setSelectedViewId(view.id);
  };

  return (
    <Paper
      shadow="sm"
      p={0}
      style={{
        width: opened ? 250 : 30,
        pointerEvents: 'all',
        transition: 'width 0.2s',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'var(--mantine-color-body)',
      }}
    >
      <Group
        justify="space-between"
        p="xs"
        wrap="nowrap"
        align="flex-start"
        style={{ minHeight: 42 }}
      >
        {opened && (
          <Text size="sm" fw={500} truncate style={{ flex: 1 }}>
            {t('components.viewMetadata.title', { defaultValue: 'Saved Views' })}
          </Text>
        )}
        <ActionIcon
          variant="subtle"
          size="xs"
          onClick={() => setOpened(!opened)}
          style={{
            position: opened ? 'relative' : 'absolute',
            top: opened ? 0 : 8,
            right: opened ? 0 : '50%',
            transform: opened ? 'none' : 'translateX(50%)',
          }}
        >
          {opened ? (
            <ChevronLeftIcon style={{ width: 16 }} />
          ) : (
            <ChevronRightIcon style={{ width: 16 }} />
          )}
        </ActionIcon>
      </Group>

      <Collapse in={opened}>
        <Box p="xs" pt={0}>
          <Button
            fullWidth
            leftSection={<CameraIcon style={{ width: 16 }} />}
            variant="light"
            size="xs"
            onClick={handleSnapshot}
            mb="xs"
          >
            {t('components.viewMetadata.snapshot', { defaultValue: 'Snapshot' })}
          </Button>

          <ScrollArea.Autosize mah={300}>
            {views.length === 0 && (
              <Text size="xs" c="dimmed" ta="center" py="sm">
                {t('components.viewMetadata.noViews', { defaultValue: 'No saved views' })}
              </Text>
            )}
            {views.map((view) => (
              <Group
                key={view.id}
                mb="xs"
                wrap="nowrap"
                align="center"
                onClick={() => setSelectedViewId(view.id)}
                style={{
                  borderBottom: '1px solid var(--mantine-color-default-border)',
                  paddingBottom: 8,
                  backgroundColor:
                    view.id === selectedViewId ? 'var(--mantine-color-blue-light)' : 'transparent',
                  padding: '4px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <Box style={{ flex: 1, overflow: 'hidden' }}>
                  <Group gap={4} wrap="nowrap">
                    <EditableText
                      value={view.name}
                      onChange={(val) => updateViewName(view.id, val)}
                      placeholder="View Name"
                      canEdit={true}
                    />
                    {view.id === activeViewId && (
                      <Text size="xs" c="blue" style={{ whiteSpace: 'nowrap' }}>
                        (active view)
                      </Text>
                    )}
                  </Group>
                  <Text size="xs" c="dimmed" truncate>
                    {new Date(view.timestamp).toLocaleString()}
                  </Text>
                </Box>
                <Group gap={2} wrap="nowrap">
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    color="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      restoreView(view);
                    }}
                    title={t('common.restore', { defaultValue: 'Restore' })}
                  >
                    <EyeIcon style={{ width: 14 }} />
                  </ActionIcon>
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    color="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeView(view.id);
                    }}
                    title={t('common.delete', { defaultValue: 'Delete' })}
                  >
                    <TrashIcon style={{ width: 14 }} />
                  </ActionIcon>
                </Group>
              </Group>
            ))}
          </ScrollArea.Autosize>
        </Box>
      </Collapse>
    </Paper>
  );
};
