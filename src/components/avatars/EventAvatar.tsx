import './EntityStyles.css';
import { Avatar, HoverCard } from '@mantine/core';
import type { Event, Relation } from 'omni-osint-crud-client';
import { RelationTooltip } from './RelationTooltip';
import { EventForm } from '../forms/EventForm';

interface Props {
  data: Event;
  relation?: Relation;
  onClick?: () => void;
  renderTooltip?: (data: Event, relation?: Relation) => React.ReactNode;
}

const defaultRenderEventTooltip = (data: Event, relation?: Relation) => (
  <RelationTooltip relation={relation}>
    <EventForm event={data} />
  </RelationTooltip>
);

export const EventAvatar: React.FC<Props> = ({
  data,
  relation,
  onClick,
  renderTooltip = defaultRenderEventTooltip,
}) => {
  return (
    <HoverCard key={data._id} width={400} withArrow shadow="md" withinPortal>
      <HoverCard.Target>
        <Avatar
          className="entity-avatar"
          size="md"
          radius="xl"
          color="grape"
          onClick={() => onClick?.()}
        >
          {data.title?.[0]}
        </Avatar>
      </HoverCard.Target>
      <HoverCard.Dropdown>{renderTooltip(data, relation)}</HoverCard.Dropdown>
    </HoverCard>
  );
};
