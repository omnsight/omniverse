import React from 'react';
import { Avatar, HoverCard } from '@mantine/core';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import type { Website, Relation } from 'omni-osint-crud-client';
import { WebsiteForm } from '../forms/WebsiteForm';
import { RelationTooltip } from './RelationTooltip';
import './EntityStyles.css';

interface Props {
  data: Website;
  relation?: Relation;
  onClick?: () => void;
  renderTooltip?: (data: Website, relation?: Relation) => React.ReactNode;
}

const defaultRenderWebsiteTooltip = (data: Website, relation?: Relation) => (
  <RelationTooltip relation={relation}>
    <WebsiteForm website={data} />
  </RelationTooltip>
);

export const WebsiteAvatar: React.FC<Props> = ({
  data,
  relation,
  onClick,
  renderTooltip = defaultRenderWebsiteTooltip,
}) => {
  return (
    <HoverCard key={data._id} width={400} withArrow shadow="md" withinPortal>
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
