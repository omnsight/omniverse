import React from 'react';
import { Group, ActionIcon, Tooltip } from '@mantine/core';
import { Editor } from '@tiptap/react';
import { ListBulletIcon, QueueListIcon, MinusIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

interface Props {
  editor?: Editor;
}

export const ListToolbar: React.FC<Props> = ({ editor }) => {
  const { t } = useTranslation();
  if (!editor) return null;

  return (
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
  );
};
