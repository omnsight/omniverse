import React from 'react';
import { Avatar, HoverCard } from '@mantine/core';
import type { V1Person, V1Relation } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { PersonCard } from './Card';
import { RelationTooltip } from '../relation/ToolTip';
import '../EntityStyles.css';

interface Props {
  data: V1Person;
  relation?: V1Relation;
  onClick?: () => void;
  renderTooltip?: (data: V1Person, relation?: V1Relation) => React.ReactNode;
}

const defaultRenderPersonTooltip = (data: V1Person, relation?: V1Relation) => (
  <RelationTooltip relation={relation}>
    <PersonCard data={data} readonly={true} />
  </RelationTooltip>
);

export const PersonAvatar: React.FC<Props> = ({
  data,
  relation,
  onClick,
  renderTooltip = defaultRenderPersonTooltip,
}) => {
  return (
    <HoverCard key={data.id} width={400} position="top" withArrow shadow="md" withinPortal>
      <HoverCard.Target>
        <Avatar
          src={null}
          alt={data.name}
          radius="xl"
          size="md"
          color="indigo"
          className="entity-avatar"
          style={{
            cursor: onClick ? 'pointer' : 'default',
            border: '2px solid white',
          }}
          onClick={() => onClick?.()}
        >
          {data.name?.[0]}
        </Avatar>
      </HoverCard.Target>
      <HoverCard.Dropdown>{renderTooltip(data, relation)}</HoverCard.Dropdown>
    </HoverCard>
  );
};
