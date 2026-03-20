import './EditorStyle.css';
import {
  CheckCircleIcon,
  ChevronDownIcon,
  InboxIcon,
  Squares2X2Icon,
} from '@heroicons/react/16/solid';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { notifications } from '@mantine/notifications';
import {
  ActionIcon,
  Box,
  Card,
  Center,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Tooltip,
  Transition,
  Typography,
  Text,
} from '@mantine/core';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import { WindowAnchor } from './extensions/WindowAnchor';
import { WindowDndExtension } from './extensions/WindowDndExtension';
import { EntityFormRenderer } from '../forms/entityForm';
import { useTranslation } from 'react-i18next';
import { TextSpecialToolbar } from './tools/TextSpecialTools';
import { UnredoToolbar } from './tools/UnredoTools';
import { HeadingToolbar } from './tools/HeadingTools';
import { TextToolbar } from './tools/TextTools';
import { ListToolbar } from './tools/ListTools';
import { useCrudClient } from '../../api/useCrudyClient';
import type { OsintView } from 'omni-osint-crud-client/types';
import { updateView } from 'omni-osint-crud-client/sdk';
import type { Entity } from '../forms/entityForm/entity';
import { useInsightStore } from '../../pages/windows/insight/insightData';

interface CarouselProps {
  entities: Entity[];
}

const EntityCarousel: React.FC<CarouselProps> = ({ entities }) => {
  const { t } = useTranslation();

  return (
    <ScrollArea h="100%" offsetScrollbars>
      <Box
        display="flex"
        p="md"
        style={{
          gap: 'var(--mantine-spacing-md)',
          alignItems: 'center',
          minHeight: '100%',
        }}
      >
        {entities.length > 0 ? (
          entities.map((entity) => (
            <Card
              key={entity.data._id}
              shadow="sm"
              padding="xs"
              radius="md"
              h="80%"
              withBorder
              style={{
                aspectRatio: '0.5',
                flexShrink: 0,
              }}
            >
              <EntityFormRenderer entity={entity} />
            </Card>
          ))
        ) : (
          <Center h="80%" w="100%">
            <Box style={{ textAlign: 'center', opacity: 0.4 }}>
              <InboxIcon style={{ width: 40, margin: '0 auto' }} />
              <Text size="sm" fw={500}>
                {t('components.editor.InsightEditor.noRelatedEntities')}
              </Text>
            </Box>
          </Center>
        )}
      </Box>
    </ScrollArea>
  );
};

interface EditorProps {
  insight: OsintView;
  entities: Entity[];
  readonly: boolean;
}

export const InsightEditor: React.FC<EditorProps> = ({ insight, entities, readonly }) => {
  const { t } = useTranslation();
  const { crudClient } = useCrudClient();
  const [opened, setOpened] = useState(false);
  const { insights, setInsights } = useInsightStore();
  const [content, setContent] = useState(insight.analysis);
  const isDirty = useMemo(() => {
    return JSON.stringify(content) !== JSON.stringify(insight.analysis);
  }, [content, insight.analysis]);

  const editor = useEditor({
    extensions: [StarterKit, Highlight, WindowAnchor, WindowDndExtension],
    editorProps: {
      attributes: {
        style: 'outline: none',
      },
    },
    content: {
      type: 'doc',
      content: content && content.length > 0 ? content : [{ type: 'paragraph' }],
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      setContent(json.content);
    },
  });

  const updateInsight = useCallback(async () => {
    if (!insight._id || !isDirty) return;

    console.debug('Updating insight', insight._id, isDirty, content, insight.analysis);
    const { data, error, status } = await updateView({
      body: { analysis: content },
      path: {
        id: insight._id,
      },
      client: crudClient,
    });

    if (error) {
      console.error(`Error [${status}] updating insight`, error);
      notifications.show({
        title: t('common.error'),
        message: t('components.editor.InsightEditor.updateInsightError'),
        color: 'red',
      });
    } else {
      setInsights(insights.map((i) => (i._id === data._id ? data : i)));
      console.log('Updated insight', data);
    }
  }, [isDirty, content, crudClient, insight._id, insights, setInsights, t]);

  useEffect(() => {
    editor?.setEditable(!readonly);
  }, [editor, readonly]);

  // auto-save
  useEffect(() => {
    if (readonly) return;
    const timer = setTimeout(() => {
      updateInsight();
    }, 10 * 1000);
    return () => clearTimeout(timer);
  }, [content, readonly, updateInsight]);

  return (
    <Paper
      h="100%"
      w="100%"
      shadow="sm"
      radius="md"
      display="flex"
      withBorder
      style={{ flexDirection: 'column' }}
    >
      <Stack gap={0} style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
        <Group p="xs" gap="xs">
          <UnredoToolbar editor={editor} />
          <Divider orientation="vertical" />
          <HeadingToolbar editor={editor} />
          <Divider orientation="vertical" />
          <TextToolbar editor={editor} />
          <Divider orientation="vertical" />
          <Tooltip label={t('common.save')} withArrow>
            <ActionIcon onClick={updateInsight} disabled={!isDirty} variant="subtle">
              <CheckCircleIcon
                style={{
                  width: '16px',
                  color: 'green',
                  opacity: isDirty ? 1 : 0.4,
                  transition: 'opacity 200ms ease, color 200ms ease',
                }}
              />
            </ActionIcon>
          </Tooltip>
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
      <Box
        p="1rem"
        h="100%"
        pos="relative"
        display="flex"
        style={{ flexDirection: 'column', overflow: 'hidden' }}
      >
        <Box style={{ flex: 1, minHeight: 0 }}>
          <Typography h="100%">
            <ScrollArea h="100%" type="auto">
              <EditorContent editor={editor} />
            </ScrollArea>
          </Typography>
        </Box>
        <Transition mounted={opened} transition="slide-up" duration={400} timingFunction="ease">
          {(styles) => (
            <Box
              h="150px"
              style={{
                ...styles,
                borderTop: '1px solid var(--mantine-color-default-border)',
                boxShadow: 'var(--mantine-shadow-xl)',
                flexShrink: 0,
              }}
            >
              <EntityCarousel entities={entities} />
            </Box>
          )}
        </Transition>
        <ActionIcon
          radius="xl"
          onClick={() => setOpened(!opened)}
          style={{
            position: 'absolute',
            bottom: opened ? '160px' : '1rem', // Adjust offset based on carousel height
            right: '1rem',
            zIndex: 11,
            transition: 'bottom 0.3s ease',
          }}
        >
          {opened ? (
            <ChevronDownIcon style={{ width: '16px' }} />
          ) : (
            <Tooltip label={t('components.editor.InsightEditor.openGallery')} withArrow>
              <Squares2X2Icon style={{ width: '16px' }} />
            </Tooltip>
          )}
        </ActionIcon>
      </Box>
    </Paper>
  );
};
