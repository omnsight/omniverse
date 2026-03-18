import React from 'react';
import { Group, ActionIcon, Tooltip } from '@mantine/core';
import { Editor } from '@tiptap/react';
import { CodeBracketIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

interface Props {
  editor?: Editor;
}

export const TextSpecialToolbar: React.FC<Props> = ({ editor }) => {
  const { t } = useTranslation();

  if (!editor) return null;

  return (
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
  );
};
