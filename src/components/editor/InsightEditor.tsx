import './EditorStyle.css';
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Tooltip,
  Typography,
  Text,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { TextSpecialToolbar } from './tools/TextSpecialTools';
import { UnredoToolbar } from './tools/UnredoTools';
import { HeadingToolbar } from './tools/HeadingTools';
import { TextToolbar } from './tools/TextTools';
import { type OsintView } from 'omni-osint-crud-client';
import { ListToolbar } from './tools/ListTools';
import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import { getEntityTitle } from '../forms/entityForm/entity';
import type { Entity } from '../forms/entityForm/entity';
import { WindowAnchor } from './extensions/WindowAnchor';
import { WindowDndExtension } from './extensions/WindowDndExtension';

interface Props {
  insight: OsintView;
  entities: Entity[];
  readonly: boolean;
}

export const Editor: React.FC<Props> = ({ insight, entities, readonly }) => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit, Highlight, WindowAnchor, WindowDndExtension],
    editorProps: {
      attributes: {
        style: 'outline: none',
      },
    },
    content: insight.analysis,
  });

  useEffect(() => {
    editor.setEditable(!readonly);
  }, [editor, readonly]);

  return (
    <Paper h="100%" w="100%" shadow="sm" radius="md" withBorder>
      <Stack gap={0} style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
        <Group p="xs" gap="xs">
          <UnredoToolbar editor={editor} />
          <Divider orientation="vertical" />
          <HeadingToolbar editor={editor} />
          <Divider orientation="vertical" />
          <TextToolbar editor={editor} />
        </Group>
        <Group
          p="xs"
          gap="xs"
          style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}
        >
          <TextSpecialToolbar editor={editor} />
          <Divider orientation="vertical" />
          <ListToolbar editor={editor} />
        </Group>
      </Stack>
      <ScrollArea h="100%" type="auto">
        <Group align="flex-start" wrap="nowrap" gap={0}>
          {/* Editor Window */}
          <Box p="1rem" style={{ flex: 1, minHeight: '100%', cursor: 'text' }}>
            <Typography>
              <EditorContent editor={editor} style={{ height: '100%' }} />
            </Typography>
          </Box>

          {/* Sticky Side Window */}
          <Box
            style={{
              position: 'sticky',
              top: 0,
              height: 'fit-content',
              borderLeft: opened ? '1px solid var(--mantine-color-default-border)' : 'none',
              width: opened ? '200px' : '40px', // Shrinks but keeps toggle visible
              transition: 'width 200ms ease',
              overflow: 'hidden',
              backgroundColor: 'var(--mantine-color-body)',
            }}
          >
            <Box p="xs" w="200px">
              <Group justify="space-between" mb="sm" wrap="nowrap">
                {opened && (
                  <Text fw={700} size="xs" truncate>
                    {t('editor.sidebarTitle')}
                  </Text>
                )}

                <Group gap={4} wrap="nowrap">
                  {opened && (
                    <Tooltip label="Restore" withArrow>
                      <ActionIcon variant="subtle" color="gray" size="sm">
                        <ArrowPathIcon style={{ width: '14px' }} />
                      </ActionIcon>
                    </Tooltip>
                  )}

                  {/* Toggle Button */}
                  <ActionIcon variant="light" size="sm" onClick={() => setOpened(!opened)}>
                    {opened ? (
                      <ChevronRightIcon style={{ width: '14px' }} />
                    ) : (
                      <ChevronLeftIcon style={{ width: '14px' }} />
                    )}
                  </ActionIcon>
                </Group>
              </Group>

              {opened && (
                <Stack gap="xs">
                  {entities.slice(0, 5).map((entity, i) => (
                    <Text key={i} size="xs" c="dimmed" lineClamp={1}>
                      {getEntityTitle(entity)}
                    </Text>
                  ))}
                  {entities.length > 5 && (
                    <Text size="xs" c="dimmed">
                      ...
                    </Text>
                  )}
                </Stack>
              )}
            </Box>
          </Box>
        </Group>
      </ScrollArea>
    </Paper>
  );
};
