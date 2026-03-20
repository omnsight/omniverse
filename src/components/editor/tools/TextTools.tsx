import React from 'react';
import { Group, ActionIcon, Tooltip } from '@mantine/core';
import { Editor } from '@tiptap/react';
import { BoldIcon, ItalicIcon, PencilIcon, MinusCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

interface Props {
  editor?: Editor;
}

export const TextToolbar: React.FC<Props> = ({ editor }) => {
  const { t } = useTranslation();

  if (!editor) return null;

  return (
    <Group gap={4}>
      <Tooltip label={t('components.editor.tools.TextTools.bold')}>
        <ActionIcon
          variant={editor.isActive('bold') ? 'filled' : 'subtle'}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon style={{ width: 16 }} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={t('components.editor.tools.TextTools.italic')}>
        <ActionIcon
          variant={editor.isActive('italic') ? 'filled' : 'subtle'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon style={{ width: 16 }} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={t('components.editor.tools.TextTools.strike')}>
        <ActionIcon
          variant={editor.isActive('strike') ? 'filled' : 'subtle'}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <MinusCircleIcon style={{ width: 16 }} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={t('components.editor.tools.TextTools.highlight')}>
        <ActionIcon
          variant={editor.isActive('highlight') ? 'filled' : 'subtle'}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <PencilIcon style={{ width: 16 }} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};
