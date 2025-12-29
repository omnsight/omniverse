import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

export const NodeHandles: React.FC = memo(() => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        style={{ background: '#555', top: -5 }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        style={{ background: '#555', top: -5 }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        style={{ background: '#555', right: -5 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={{ background: '#555', right: -5 }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        style={{ background: '#555', bottom: -5 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{ background: '#555', bottom: -5 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        style={{ background: '#555', left: -5 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        style={{ background: '#555', left: -5 }}
      />
    </>
  );
});
