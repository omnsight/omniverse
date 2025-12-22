import React from 'react';
import { Avatar, HoverCard } from '@mantine/core';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import type { V1Website, V1Relation } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { WebsiteCard } from './Card';
import { RelationTooltip } from '../relation/ToolTip';
import '../EntityStyles.css';

interface Props {
  data: V1Website;
  relation?: V1Relation;
  onClick?: () => void;
  renderTooltip?: (data: V1Website, relation?: V1Relation) => React.ReactNode;
}

const defaultRenderWebsiteTooltip = (data: V1Website, relation?: V1Relation) => (
  <RelationTooltip relation={relation}>
    <WebsiteCard data={data} />
  </RelationTooltip>
);

export const WebsiteAvatar: React.FC<Props> = ({
  data,
  relation,
  onClick,
  renderTooltip = defaultRenderWebsiteTooltip,
}) => {
  return (
    <HoverCard key={data.id} width={400} withArrow shadow="md" withinPortal>
      <HoverCard.Target>
        <Avatar
          className="entity-avatar"
          size="md"
          radius="xl"
          color="cyan"
          style={{ cursor: onClick ? 'pointer' : 'default' }}
          onClick={() => onClick?.()}
        >
          <ArrowTopRightOnSquareIcon style={{ width: '50%', height: '50%' }} />
        </Avatar>
      </HoverCard.Target>
      <HoverCard.Dropdown>{renderTooltip(data, relation)}</HoverCard.Dropdown>
    </HoverCard>
  );
};
