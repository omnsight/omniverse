import React from 'react';
import { ActionIcon, Avatar, Group, HoverCard, Text } from '@mantine/core';
import { LinkIcon } from '@heroicons/react/24/solid';
import type { V1Source, V1Relation } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { SourceCard } from './Card';
import { RelationTooltip } from '../relation/ToolTip';
import '../EntityStyles.css';
import { useTranslation } from 'react-i18next';
import { getLocalizedAttribute } from '../common/localeSupport';

interface Props {
  width: number;
  data: V1Source;
  relation?: V1Relation;
  renderTooltip?: (data: V1Source, relation?: V1Relation) => React.ReactNode;
}

const defaultRenderSourceTooltip = (data: V1Source, relation?: V1Relation) => (
  <RelationTooltip relation={relation}>
    <SourceCard data={data} />
  </RelationTooltip>
);

export const SourceAvatar: React.FC<Props> = ({
  width,
  data,
  relation,
  renderTooltip = defaultRenderSourceTooltip,
}) => {
  return (
    <HoverCard key={data.id} width={width} position="left" withArrow shadow="md" withinPortal>
      <HoverCard.Target>
        <Avatar
          component={data.url ? 'a' : 'div'}
          href={data.url}
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
  const { i18n } = useTranslation();

  return (
    <Group wrap="nowrap" gap={0}>
      <HoverCard width={width} openDelay={500} withArrow shadow="md">
        <HoverCard.Target>
          <Text size="sm" fw={500} truncate="end">
            {getLocalizedAttribute(data, 'Name', i18n.language) || data.name || data.url}
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
