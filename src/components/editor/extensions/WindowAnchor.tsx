import { Node, mergeAttributes } from '@tiptap/core';
import { type NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Button, Tooltip } from '@mantine/core';
import { ArrowPathIcon } from '@heroicons/react/16/solid';
import { useTranslation } from 'react-i18next';
import { useWindowStoreActions } from '../../../stores/windowStateStore';

export const WindowAnchorComponent: React.FC<NodeViewProps> = ({ node }) => {
  const { t } = useTranslation();
  const { restore } = useWindowStoreActions();
  const { type, state, label } = node.attrs;

  return (
    <NodeViewWrapper className="inline-block mx-1">
      <Tooltip label={t('components.editor.extensions.WindowAnchor.restore')}>
        <Button
          variant="light"
          size="compact-xs"
          leftSection={<ArrowPathIcon className="w-4 h-4" />}
          onClick={() => restore(type, state)}
        >
          {label}
        </Button>
      </Tooltip>
    </NodeViewWrapper>
  );
};

export const WindowAnchor = Node.create({
  name: 'windowAnchor',
  group: 'inline', // or 'block' depending on your UI
  inline: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      type: { default: null },
      state: { default: {} },
      label: { default: 'Restorable Window' },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-window-anchor]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-window-anchor': '' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(WindowAnchorComponent);
  },
});
