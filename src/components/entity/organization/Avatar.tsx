import '../EntityStyles.css';
import { Avatar, HoverCard } from '@mantine/core';
import type { V1Organization, V1Relation } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { OrganizationCard } from './Card';
import { RelationTooltip } from '../relation/ToolTip';

interface Props {
  data: V1Organization;
  relation?: V1Relation;
  onClick?: () => void;
  renderTooltip?: (data: V1Organization, relation?: V1Relation) => React.ReactNode;
}

const defaultRenderOrganizationTooltip = (data: V1Organization, relation?: V1Relation) => (
  <RelationTooltip relation={relation}>
    <OrganizationCard data={data} readonly={true} />
  </RelationTooltip>
);

export const OrganizationAvatar: React.FC<Props> = ({
  data,
  relation,
  onClick,
  renderTooltip = defaultRenderOrganizationTooltip,
}) => {
  return (
    <HoverCard key={data.id} width={400} withArrow shadow="md" withinPortal>
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
