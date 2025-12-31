import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Badge, Tooltip } from '@mantine/core';
import { EyeIcon } from '@heroicons/react/24/solid';
import { useViewMetadataStore, useViewMetadataActions } from '../../../store/viewMetadata';
import { useGraphToolState } from '../../../store/graphToolState';
import { useSelectionActions } from '../../../store/selection';

const ViewComponent = (props: any) => {
  const viewId = props.node.attrs.id;
  const view = useViewMetadataStore((state) => state.views.find((v) => v.id === viewId));
  const activeViewId = useViewMetadataStore((state) => state.activeViewId);
  const { setActiveViewId } = useViewMetadataActions();
  const setViewMode = useGraphToolState((state) => state.actions.changeViewMode);
  const { select } = useSelectionActions();

  const handleClick = () => {
    if (view) {
      setViewMode(view.graphViewMode);
      select(view.selectedIds);
      setActiveViewId(view.id);
    }
  };

  if (!view) {
    return (
      <NodeViewWrapper style={{ display: 'inline-block', margin: '0 4px' }}>
        <Badge color="red" variant="light">
          Deleted View
        </Badge>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper style={{ display: 'inline-block', margin: '0 4px', verticalAlign: 'middle' }}>
      <Tooltip label="Click to activate view" withArrow>
        <Badge
          color={activeViewId === view.id ? 'blue' : 'gray'}
          variant={activeViewId === view.id ? 'filled' : 'light'}
          style={{ cursor: 'pointer', paddingLeft: 0 }}
          leftSection={<EyeIcon style={{ width: 12, height: 12, marginLeft: 6 }} />}
          onClick={handleClick}
        >
          {view.name}
        </Badge>
      </Tooltip>
    </NodeViewWrapper>
  );
};

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

export const ViewExtension = Node.create({
  name: 'viewComponent',

  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'view-component',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['view-component', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ViewComponent);
  },
});
