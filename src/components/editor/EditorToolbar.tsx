import React from 'react';
import {
  Group,
  ActionIcon,
  Button,
  Select,
  NumberInput,
  Tooltip,
  Stack,
  Divider,
  Text,
} from '@mantine/core';
import { Editor } from '@tiptap/react';
import {
  BoldIcon,
  ItalicIcon,
  ListBulletIcon,
  CameraIcon,
  PlayIcon,
  StopIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  QueueListIcon,
  CodeBracketIcon,
  ChatBubbleBottomCenterTextIcon,
  MinusIcon,
  PencilIcon,
  MinusCircleIcon,
} from '@heroicons/react/24/solid';
import type { EntityViewType } from '../../store/viewMetadata';
import { useTranslation } from 'react-i18next';

interface Props {
  editor: Editor | null;
  viewType: EntityViewType;
  onViewTypeChange: (type: EntityViewType) => void;
  onInsertView: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playSpeed: number;
  onPlaySpeedChange: (val: number) => void;
}

export const EditorToolbar: React.FC<Props> = ({
  editor,
  viewType,
  onViewTypeChange,
  onInsertView,
  isPlaying,
  onTogglePlay,
  playSpeed,
  onPlaySpeedChange,
}) => {
  const { t } = useTranslation();
  if (!editor) return null;

  return (
    <Stack gap={0} style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
      {/* Row 1: Editing Tools */}
      <Group p="xs" gap="xs">
        <Group gap={4}>
          <Tooltip label={t('components.editor.tools.undo')}>
            <ActionIcon
              variant="subtle"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <ArrowUturnLeftIcon style={{ width: 16 }} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('components.editor.tools.redo')}>
            <ActionIcon
              variant="subtle"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <ArrowUturnRightIcon style={{ width: 16 }} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Divider orientation="vertical" />

        <Group gap={4}>
          <Tooltip label={t('components.editor.tools.h1')}>
            <ActionIcon
              variant={editor.isActive('heading', { level: 1 }) ? 'filled' : 'subtle'}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <Text size="xs" fw={700}>
                H1
              </Text>
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('components.editor.tools.h2')}>
            <ActionIcon
              variant={editor.isActive('heading', { level: 2 }) ? 'filled' : 'subtle'}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Text size="xs" fw={700}>
                H2
              </Text>
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('components.editor.tools.h3')}>
            <ActionIcon
              variant={editor.isActive('heading', { level: 3 }) ? 'filled' : 'subtle'}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Text size="xs" fw={700}>
                H3
              </Text>
            </ActionIcon>
          </Tooltip>
        </Group>

        <Divider orientation="vertical" />

        <Group gap={4}>
          <Tooltip label={t('components.editor.tools.bold')}>
            <ActionIcon
              variant={editor.isActive('bold') ? 'filled' : 'subtle'}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <BoldIcon style={{ width: 16 }} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('components.editor.tools.italic')}>
            <ActionIcon
              variant={editor.isActive('italic') ? 'filled' : 'subtle'}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <ItalicIcon style={{ width: 16 }} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('components.editor.tools.strike')}>
            <ActionIcon
              variant={editor.isActive('strike') ? 'filled' : 'subtle'}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <MinusCircleIcon style={{ width: 16 }} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('components.editor.tools.highlight')}>
            <ActionIcon
              variant={editor.isActive('highlight') ? 'filled' : 'subtle'}
              onClick={() => editor.chain().focus().toggleHighlight().run()}
            >
              <PencilIcon style={{ width: 16 }} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Divider orientation="vertical" />

        <Group gap={4}>
          <Tooltip label={t('components.editor.tools.codeBlock')}>
            <ActionIcon
              variant={editor.isActive('codeBlock') ? 'filled' : 'subtle'}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <CodeBracketIcon style={{ width: 16 }} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('components.editor.tools.blockquote')}>
            <ActionIcon
              variant={editor.isActive('blockquote') ? 'filled' : 'subtle'}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <ChatBubbleBottomCenterTextIcon style={{ width: 16 }} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {/* Row 2: Lists & App Specific Controls */}
      <Group p="xs" gap="xs" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
        <Group gap={4}>
          <Tooltip label={t('components.editor.tools.bulletList')}>
            <ActionIcon
              variant={editor.isActive('bulletList') ? 'filled' : 'subtle'}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <ListBulletIcon style={{ width: 16 }} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('components.editor.tools.orderedList')}>
            <ActionIcon
              variant={editor.isActive('orderedList') ? 'filled' : 'subtle'}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <QueueListIcon style={{ width: 16 }} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('components.editor.tools.horizontalRule')}>
            <ActionIcon
              variant="subtle"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              <MinusIcon style={{ width: 16 }} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Divider orientation="vertical" />

        <Select
          data={[
            {
              value: 'geovision',
              label: t('components.editor.viewType.geovision'),
            },
            {
              value: 'sparkgraph',
              label: t('components.editor.viewType.sparkgraph'),
            },
          ]}
          value={viewType}
          onChange={(val) => onViewTypeChange(val as EntityViewType)}
          size="xs"
          w={120}
          allowDeselect={false}
        />

        <Tooltip label={t('components.editor.insertViewTooltip')}>
          <Button
            size="xs"
            variant="light"
            leftSection={<CameraIcon style={{ width: 14 }} />}
            onClick={onInsertView}
          >
            {t('components.editor.insertViewButton')}
          </Button>
        </Tooltip>

        <Divider orientation="vertical" />

        <Group gap={8}>
          <Tooltip label={t('components.editor.presentationMode')}>
            <ActionIcon
              variant={isPlaying ? 'filled' : 'light'}
              color={isPlaying ? 'red' : 'green'}
              onClick={onTogglePlay}
            >
              {isPlaying ? <StopIcon style={{ width: 16 }} /> : <PlayIcon style={{ width: 16 }} />}
            </ActionIcon>
          </Tooltip>

          <NumberInput
            value={playSpeed}
            onChange={(val) => onPlaySpeedChange(Number(val) || 2000)}
            min={500}
            step={500}
            size="xs"
            w={80}
            suffix=" ms"
            disabled={isPlaying}
          />
        </Group>
      </Group>
    </Stack>
  );
};
