import React from 'react';
import { Avatar, HoverCard } from '@mantine/core';
import type { Person, Relation } from 'omni-osint-crud-client';
import { PersonForm } from '../forms/PersonForm';
import { RelationTooltip } from './RelationTooltip';
import './EntityStyles.css';

interface Props {
  data: Person;
  relation?: Relation;
  onClick?: () => void;
  renderTooltip?: (data: Person, relation?: Relation) => React.ReactNode;
}

const defaultRenderPersonTooltip = (data: Person, relation?: Relation) => (
  <RelationTooltip relation={relation}>
    <PersonForm person={data} />
  </RelationTooltip>
);

export const PersonAvatar: React.FC<Props> = ({
  data,
  relation,
  onClick,
  renderTooltip = defaultRenderPersonTooltip,
}) => {
  return (
    <HoverCard key={data._id} width={400} position="top" withArrow shadow="md" withinPortal>
      <HoverCard.Target>
        <Avatar
          src={null}
          alt={data.name || ''}
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
          {data.name?.[0] || ''}
        </Avatar>
      </HoverCard.Target>
      <HoverCard.Dropdown>{renderTooltip(data, relation)}</HoverCard.Dropdown>
    </HoverCard>
  );
};
