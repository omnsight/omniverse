import React from 'react';
import { Group, ActionIcon, Tooltip } from '@mantine/core';
import { Editor } from '@tiptap/react';
import { ArrowUturnLeftIcon, ArrowUturnRightIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

interface Props {
  editor?: Editor;
}

export const UnredoToolbar: React.FC<Props> = ({ editor }) => {
  const { t } = useTranslation();

  if (!editor) return null;

  return (
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
  );
};
