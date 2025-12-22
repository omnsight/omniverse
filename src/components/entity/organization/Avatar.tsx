import '../EntityStyles.css';
import { Avatar, HoverCard } from '@mantine/core';
import type { V1Organization, V1Relation } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { OrganizationCard } from './Card';
import { RelationTooltip } from '../relation/ToolTip';
import { useTranslation } from 'react-i18next';
import { getLocalizedAttribute } from '../common/localeSupport';

interface Props {
  data: V1Organization;
  relation?: V1Relation;
  onClick?: () => void;
  renderTooltip?: (data: V1Organization, relation?: V1Relation) => React.ReactNode;
}

const defaultRenderOrganizationTooltip = (data: V1Organization, relation?: V1Relation) => (
  <RelationTooltip relation={relation}>
    <OrganizationCard data={data} />
  </RelationTooltip>
);

export const OrganizationAvatar: React.FC<Props> = ({
  data,
  relation,
  onClick,
  renderTooltip = defaultRenderOrganizationTooltip,
}) => {
  const { i18n } = useTranslation();
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
          {getLocalizedAttribute(data, 'Name', i18n.language)?.[0] || data.name?.[0]}
        </Avatar>
      </HoverCard.Target>
      <HoverCard.Dropdown>{renderTooltip(data, relation)}</HoverCard.Dropdown>
    </HoverCard>
  );
};
