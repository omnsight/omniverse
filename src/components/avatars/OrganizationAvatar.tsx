import './EntityStyles.css';
import { Avatar, HoverCard } from '@mantine/core';
import type { Organization, Relation } from 'omni-osint-crud-client';
import { OrganizationForm } from '../forms/OrganizationForm';
import { RelationTooltip } from './RelationTooltip';

interface Props {
  data: Organization;
  relation?: Relation;
  onClick?: () => void;
  renderTooltip?: (data: Organization, relation?: Relation) => React.ReactNode;
}

const defaultRenderOrganizationTooltip = (data: Organization, relation?: Relation) => (
  <RelationTooltip relation={relation}>
    <OrganizationForm organization={data} />
  </RelationTooltip>
);

export const OrganizationAvatar: React.FC<Props> = ({
  data,
  relation,
  onClick,
  renderTooltip = defaultRenderOrganizationTooltip,
}) => {
  return (
    <HoverCard key={data._id} width={400} withArrow shadow="md" withinPortal>
      <HoverCard.Target>
        <Avatar
          className="entity-avatar"
          size="md"
          radius="xl"
          color="blue"
          onClick={() => onClick?.()}
        >
          {data.name?.[0]}
        </Avatar>
      </HoverCard.Target>
      <HoverCard.Dropdown>{renderTooltip(data, relation)}</HoverCard.Dropdown>
    </HoverCard>
  );
};
