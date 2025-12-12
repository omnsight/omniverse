import React from 'react';
import { Group, Text, Stack, Avatar, Box, TextInput, rem, Tooltip, Button, TagsInput, Badge, HoverCard } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { DateTimePicker } from '@mantine/dates';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import type { V1Organization, V1RelatedEntity, V1Relation } from '@omnsight/clients/dist/geovision/geovision.js';
import { RelationTooltip } from './RelationEntity';

const iconStyle = { width: rem(18), height: rem(18) };

import './EntityStyles.css';

const defaultRenderOrganizationTooltip = (data: V1Organization, relation?: V1Relation) => (
  <RelationTooltip relation={relation}>
    <OrganizationCard data={data} edit={false} />
  </RelationTooltip>
);

// --- CARD COMPONENT ---
interface OrganizationCardProps {
  data?: V1Organization;
  edit: boolean;
  onChange?: (data: Partial<V1Organization>) => void;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({ data, edit, onChange }) => {
  const { t } = useTranslation();

  if (edit) {
    return (
      <Stack>
        <TextInput label={t('common.name')} placeholder={t('common.enterName')} defaultValue={data?.name} onChange={e => onChange?.({ name: e.target.value })} />
        <TextInput label={t('common.type')} placeholder={t('common.enterType')} defaultValue={data?.type} onChange={e => onChange?.({ type: e.target.value })} />
        <DateTimePicker
          label={t('organization.foundedDate')}
          placeholder={t('organization.selectFoundedDate')}
          value={data?.foundedAt ? new Date(parseInt(data.foundedAt) * 1000) : null}
          onChange={(date: any) => onChange?.({ foundedAt: date ? (new Date(date).getTime() / 1000).toString() : undefined })}
          valueFormat="YYYY-MM-DD HH:mm"
        />
        <DateTimePicker
          label={t('organization.discoveredDate')}
          placeholder={t('organization.selectDiscoveredDate')}
          value={data?.discoveredAt ? new Date(parseInt(data.discoveredAt) * 1000) : null}
          onChange={(date: any) => onChange?.({ discoveredAt: date ? (new Date(date).getTime() / 1000).toString() : undefined })}
          valueFormat="YYYY-MM-DD HH:mm"
        />
        <TagsInput
          label={t('common.tags')}
          placeholder={t('common.enterTags')}
          defaultValue={data?.tags}
          onChange={(tags) => onChange?.({ tags })}
        />
      </Stack>
    );
  } else {
    const formatDate = (ts?: string) => {
      if (!ts) return null;
      const d = new Date(parseInt(ts) * 1000);
      return d.toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
      <Stack gap="xs" key={data?.id}>
        <Text size="lg" fw={700}>{data?.name}</Text>
        <Text size="sm" c="dimmed">{t('common.type')}: {data?.type}</Text>
        {data?.foundedAt && <Text size="sm" c="dimmed">{t('organization.foundedDate')}: {formatDate(data.foundedAt)}</Text>}
        {data?.tags && data.tags.length > 0 && (
          <Group gap={4}>
            {data.tags.map(tag => <Badge key={tag} size="sm" variant="outline">{tag}</Badge>)}
          </Group>
        )}
      </Stack>
    );
  }
};

// -- AVATAR --
interface OrganizationAvatarProps {
  data?: V1Organization;
  relation?: V1Relation;
  edit: boolean;
  onClick?: () => void;
  renderTooltip?: (data: V1Organization, relation?: V1Relation) => React.ReactNode;
}

export const OrganizationAvatar: React.FC<OrganizationAvatarProps> = ({ data, relation, edit, onClick, renderTooltip = defaultRenderOrganizationTooltip }) => {
  const { t } = useTranslation();
  if (data) {
    return (
      <HoverCard
        key={data.id}
        width={400}
        withArrow
        shadow="md"
        withinPortal
      >
        <HoverCard.Target>
          <Avatar
            className="entity-avatar"
            size="md"
            radius="xl"
            color="blue"
            style={{ cursor: edit ? 'pointer' : 'default' }}
            onClick={() => edit && onClick?.()}
          >
            {data.name?.[0]}
          </Avatar>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          {renderTooltip(data, relation)}
        </HoverCard.Dropdown>
      </HoverCard>
    );
  } else {
    return (
      <Tooltip key='notfound' label={t('organization.notFound')} withArrow>
        <Avatar size="md" radius="xl" color="gray" variant="light">
          <XMarkIcon style={{ width: '50%', height: '50%' }} />
        </Avatar>
      </Tooltip>
    );
  }
};

// --- LIST COMPONENT ---
interface OrganizationListProps {
  items: V1RelatedEntity[];
  readOnly?: boolean;
  variant: 'avatar' | 'card';
  onSelect: (entity: V1RelatedEntity) => void;
  onCreate: (entity: V1RelatedEntity) => void;
}

export const OrganizationList: React.FC<OrganizationListProps> = ({ items, onSelect, onCreate, readOnly = false, variant }) => {
  const { t } = useTranslation();
  if (variant === 'avatar') {
    return (
      <Box mb="xl">
        <Group mb="sm">
          <Text fw={600}>{t('organization.relatedOrganizations')}</Text>
        </Group>
        <Avatar.Group>
          {items.length === 0 ? (
            <OrganizationAvatar edit={false} onClick={() => { }} />
          ) : (
            items.map(rel => <OrganizationAvatar key={rel.organization?.id} data={rel.organization} relation={rel.relation} edit={!readOnly} onClick={() => !readOnly && onSelect(rel)} />)
          )}
          {!readOnly && (
            <Avatar key='neworg' size="md" radius="xl" color="blue" style={{ cursor: 'pointer', border: '2px solid white' }} onClick={() => onCreate({ organization: {}, relation: {} })}>
              <PlusIcon style={{ width: '50%', height: '50%' }} />
            </Avatar>
          )}
        </Avatar.Group>
      </Box>
    );
  } else {
    return (
      <Stack gap="xs">
        {items.slice(0, 4).map(rel => <OrganizationCard data={rel.organization} edit={!readOnly} />)}
        {/* Create Button */}
        {!readOnly && (
          <Button fullWidth onClick={() => onCreate({ organization: {}, relation: {} })}>
            <PlusIcon style={iconStyle} />
          </Button>
        )}
      </Stack>
    );
  }
};