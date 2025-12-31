import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import { Box, Paper, ScrollArea, Typography } from '@mantine/core';
import { ViewExtension } from './extensions/ViewExtension';
import { EditorToolbar } from './EditorToolbar';
import { usePresentation } from './hooks/usePresentation';
import {
  type EntityViewType,
  useViewMetadataActions,
  useViewMetadataStore,
} from '../../store/viewMetadata';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';

interface Props {
  viewType: EntityViewType;
  setViewType: (type: EntityViewType) => void;
}

export const Editor: React.FC<Props> = ({ viewType, setViewType }) => {
  const { t } = useTranslation();
  const { restoreView } = useViewMetadataActions();
  const { views, activeViewId } = useViewMetadataStore();

  const editor = useEditor({
    extensions: [StarterKit, ViewExtension, Highlight],
    editorProps: {
      attributes: {
        style: 'outline: none',
      },
    },
    content: `
      <h2>${t('components.editor.title')}</h2>
      <p>${t('components.editor.placeholder')}</p>
    `,
  });

  const { isPlaying, start, stop } = usePresentation({
    editor,
    speed: 2000,
    onViewEncountered: (viewId) => {
      const view = views.find((v) => v.id === viewId);
      if (view) {
        // We need to set the view type if it differs
        if (view.viewType !== viewType) {
          setViewType(view.viewType);
        }
        restoreView(view);
      }
    },
  });

  const [playSpeed, setPlaySpeed] = React.useState(2000);

  const handleInsertView = () => {
    if (!editor) return;

    if (!activeViewId) {
      notifications.show({
        title: t('common.error'),
        message: t('components.editor.noActiveView'),
        color: 'red',
      });
      return;
    }

    // Insert Node into Editor
    editor
      .chain()
      .focus()
      .insertContent([
        {
          type: 'viewComponent',
          attrs: { id: activeViewId },
        },
        {
          type: 'text',
          text: ' ',
        },
      ])
      .run();
  };

  return (
    <Paper shadow="sm" radius="md" withBorder style={{ height: '100%' }}>
      <EditorToolbar
        editor={editor}
        viewType={viewType}
        onViewTypeChange={setViewType}
        onInsertView={handleInsertView}
        isPlaying={isPlaying}
        onTogglePlay={isPlaying ? stop : start}
        playSpeed={playSpeed}
        onPlaySpeedChange={setPlaySpeed}
      />
      <ScrollArea h="100%" type="auto">
        <Typography>
          <Box p="1rem" style={{ minHeight: '100%', cursor: 'text' }}>
            <EditorContent editor={editor} style={{ height: '100%' }} />
          </Box>
        </Typography>
      </ScrollArea>
    </Paper>
  );
};
