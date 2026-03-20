import React from 'react';
import { Group, ActionIcon, Tooltip, Text } from '@mantine/core';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

interface Props {
  editor?: Editor;
}

export const HeadingToolbar: React.FC<Props> = ({ editor }) => {
  const { t } = useTranslation();

  if (!editor) return null;

  return (
    <Group gap={4}>
      <Tooltip label={t('components.editor.tools.HeadingTools.h1')}>
        <ActionIcon
          variant={editor.isActive('heading', { level: 1 }) ? 'filled' : 'subtle'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Text size="xs" fw={700}>
            H1
          </Text>
        </ActionIcon>
      </Tooltip>
      <Tooltip label={t('components.editor.tools.HeadingTools.h2')}>
        <ActionIcon
          variant={editor.isActive('heading', { level: 2 }) ? 'filled' : 'subtle'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Text size="xs" fw={700}>
            H2
          </Text>
        </ActionIcon>
      </Tooltip>
      <Tooltip label={t('components.editor.tools.HeadingTools.h3')}>
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
  );
};
