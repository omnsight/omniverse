import { Node, mergeAttributes } from '@tiptap/core';
import { type NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Badge, Tooltip } from '@mantine/core';
import { ArrowPathIcon } from '@heroicons/react/16/solid';
import { useTranslation } from 'react-i18next';
import { useWindowDragStoreActions } from '../../../stores/windowDragStateStore';

export const WindowAnchorComponent: React.FC<NodeViewProps> = ({ node }) => {
  const { t } = useTranslation();
  const { restore } = useWindowDragStoreActions();
  const { type, state, label } = node.attrs;

  return (
    <NodeViewWrapper as="span" className="inline-block align-middle mx-1">
      <Tooltip label={t('components.editor.extensions.WindowAnchor.restore')}>
        <Badge
          variant="light"
          size="sm"
          radius="sm"
          leftSection={<ArrowPathIcon className="w-3 h-3" />}
          onClick={(e) => {
            // Prevent TipTap from selecting the node when clicking the badge
            e.preventDefault();
            e.stopPropagation();
            restore(type, state);
          }}
          style={{ 
            cursor: 'pointer',
            textTransform: 'none', // Keeps your labels from being forced to uppercase
            verticalAlign: 'middle',
            userSelect: 'none'
          }}
        >
          {label}
        </Badge>
      </Tooltip>
    </NodeViewWrapper>
  );
};

export const WindowAnchor = Node.create({
  name: 'windowAnchor',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  draggable: true,

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
