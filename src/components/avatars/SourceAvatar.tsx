import React from 'react';
import { ActionIcon, Avatar, Group, HoverCard, Text } from '@mantine/core';
import { LinkIcon } from '@heroicons/react/24/solid';
import type { Source, Relation } from 'omni-osint-crud-client';
import { SourceForm } from '../forms/SourceForm';
import { RelationTooltip } from './RelationTooltip';
import './EntityStyles.css';

interface Props {
  width: number;
  data: Source;
  relation?: Relation;
  renderTooltip?: (data: Source, relation?: Relation) => React.ReactNode;
}

const defaultRenderSourceTooltip = (data: Source, relation?: Relation) => (
  <RelationTooltip relation={relation}>
    <SourceForm source={data} />
  </RelationTooltip>
);

export const SourceAvatar: React.FC<Props> = ({
  width,
  data,
  relation,
  renderTooltip = defaultRenderSourceTooltip,
}) => {
  return (
    <HoverCard key={data._id} width={width} position="left" withArrow shadow="md" withinPortal>
      <HoverCard.Target>
        <Avatar
          component={data.url ? 'a' : 'div'}
          href={data.url || '#'}
          target="_blank"
          className="entity-avatar"
          size="md"
          radius="xl"
          color="indigo"
        >
          <LinkIcon style={{ width: '50%', height: '50%' }} />
        </Avatar>
      </HoverCard.Target>
      <HoverCard.Dropdown>{renderTooltip(data, relation)}</HoverCard.Dropdown>
    </HoverCard>
  );
};

export const SourceAvatarRow: React.FC<Props> = ({
  width,
  data,
  relation,
  renderTooltip = defaultRenderSourceTooltip,
}) => {
  return (
    <Group wrap="nowrap" gap={0}>
      <HoverCard width={width} openDelay={500} withArrow shadow="md">
        <HoverCard.Target>
          <Text size="sm" fw={500} truncate="end">
            {data.name || data.url}
          </Text>
        </HoverCard.Target>
        <HoverCard.Dropdown>{renderTooltip(data, relation)}</HoverCard.Dropdown>
      </HoverCard>
      {data.url && (
        <ActionIcon
          component="a"
          href={data.url}
          target="_blank"
          variant="subtle"
          size="sm"
          color="blue"
          ml={4}
        >
          <LinkIcon />
        </ActionIcon>
      )}
    </Group>
  );
};
