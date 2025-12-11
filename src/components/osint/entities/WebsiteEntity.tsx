import React from 'react';
import { Group, Text, ActionIcon, Stack, Avatar, Box, TextInput, rem, Tooltip, Button, TagsInput, Badge, Textarea, HoverCard } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { DateInput } from '@mantine/dates';
import { PlusIcon, ArrowTopRightOnSquareIcon, XMarkIcon } from '@heroicons/react/24/solid';
import type { V1Website, V1RelatedEntity, V1Relation } from '@omnsight/clients/dist/geovision/geovision.js';
import { RelationTooltip } from './RelationEntity';
import './EntityStyles.css';

const iconStyle = { width: rem(18), height: rem(18) };

const defaultRenderWebsiteTooltip = (data: V1Website, relation?: V1Relation) => (
  <RelationTooltip relation={relation}>
    <WebsiteCard data={data} edit={false} />
  </RelationTooltip>
);

// --- CARD COMPONENT ---
interface WebsiteCardProps {
  data?: V1Website;
  edit: boolean;
  onChange?: (data: Partial<V1Website>) => void;
}

export const WebsiteCard: React.FC<WebsiteCardProps> = ({ data, edit, onChange }) => {
  const { t } = useTranslation();

  if (edit) {
    return (
      <Stack>
        <TextInput label={t('common.domain')} defaultValue={data?.domain} onChange={e => onChange?.({ domain: e.target.value })} />
        <TextInput label="URL" defaultValue={data?.url} onChange={e => onChange?.({ url: e.target.value })} />
        <TextInput label={t('common.title')} defaultValue={data?.title} onChange={e => onChange?.({ title: e.target.value })} />
        <Textarea label={t('common.description')} defaultValue={data?.description} onChange={e => onChange?.({ description: e.target.value })} />
        <DateInput
          label={t('website.foundedDate')}
          value={data?.foundedAt ? new Date(parseInt(data.foundedAt)) : null}
          onChange={(date: any) => onChange?.({ foundedAt: date ? new Date(date).getTime().toString() : undefined })}
        />
        <TagsInput
          label={t('common.tags')}
          defaultValue={data?.tags}
          onChange={(tags) => onChange?.({ tags })}
        />
      </Stack>
    );
  } else {
    const formatDate = (ts?: string) => {
      if (!ts) return null;
      const d = new Date(parseInt(ts));
      return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
    };

    return (
      <Stack gap="xs">
        <Group>
          <Text size="lg" fw={700}>{data?.title}</Text>
          {data?.url && (
            <ActionIcon component="a" href={data.url} target="_blank" variant="subtle" size="sm">
              <ArrowTopRightOnSquareIcon style={{ width: '70%', height: '70%' }} />
            </ActionIcon>
          )}
        </Group>
        <Text size="sm" c="dimmed">{data?.domain}</Text>
        <Text size="sm">{data?.description}</Text>
        <Text size="sm" c="dimmed">{t('website.foundedDate')}: {formatDate(data?.foundedAt)}</Text>
        {data?.tags && data.tags.length > 0 && (
          <Group gap={4}>
            <Text size="sm">{t('common.tags')}:</Text>
            {data.tags.map(tag => <Badge key={tag} size="sm" variant="outline">{tag}</Badge>)}
          </Group>
        )}
      </Stack>
    );
  }
};

// -- AVATAR --
interface WebsiteAvatarProps {
  data?: V1Website;
  relation?: V1Relation;
  edit: boolean;
  onClick?: () => void;
  renderTooltip?: (data: V1Website, relation?: V1Relation) => React.ReactNode;
}

export const WebsiteAvatar: React.FC<WebsiteAvatarProps> = ({ data, relation, edit, onClick, renderTooltip = defaultRenderWebsiteTooltip }) => {
  const { t } = useTranslation();
  if (data) {
    return (
      <HoverCard
        key={data.id}
        width={300}
        withArrow
        shadow="md"
        withinPortal
      >
        <HoverCard.Target>
          <Avatar
            className="entity-avatar"
            size="md"
            radius="xl"
            color="cyan"
            style={{ cursor: edit ? 'pointer' : 'default' }}
            onClick={() => edit && onClick?.()}
          >
            <ArrowTopRightOnSquareIcon style={{ width: '50%', height: '50%' }} />
          </Avatar>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          {renderTooltip(data, relation)}
        </HoverCard.Dropdown>
      </HoverCard>
    );
  } else {
    return (
      <Tooltip label={t('website.notFound')} withArrow>
        <Avatar size="md" radius="xl" color="gray" variant="light">
          <XMarkIcon style={{ width: '50%', height: '50%' }} />
        </Avatar>
      </Tooltip>
    );
  }
};

// --- LIST COMPONENT ---
interface WebsiteListProps {
  items: V1RelatedEntity[];
  readOnly?: boolean;
  variant: 'avatar' | 'card';
  onSelect: (entity: V1RelatedEntity) => void;
  onCreate: (entity: V1RelatedEntity) => void;
}

export const WebsiteList: React.FC<WebsiteListProps> = ({ items, onSelect, onCreate, readOnly = false, variant }) => {
  const { t } = useTranslation();
  if (variant === 'avatar') {
    return (
      <Box mb="xl">
        <Group mb="sm">
          <Text fw={600}>{t('website.relatedWebsites')}</Text>
        </Group>
        <Avatar.Group>
          {items.length === 0 ? (
            <WebsiteAvatar edit={false} onClick={() => { }} />
          ) : (
            items.map(rel => <WebsiteAvatar key={rel.website?.id} data={rel.website} relation={rel.relation} edit={!readOnly} onClick={() => !readOnly && onSelect(rel)} />)
          )}
          {!readOnly && (
            <Avatar key='newwebsite' size="md" radius="xl" color="cyan" style={{ cursor: 'pointer', border: '2px solid white' }} onClick={() => onCreate({ website: {}, relation: {} })}>
              <PlusIcon style={{ width: '50%', height: '50%' }} />
            </Avatar>
          )}
        </Avatar.Group>
      </Box>
    );
  } else {
    return (
      <Stack gap="xs">
        {items.slice(0, 4).map(rel => <WebsiteCard data={rel.website} edit={!readOnly} />)}
        {/* Create Button */}
        {!readOnly && (
          <Button fullWidth onClick={() => onCreate({ website: {}, relation: {} })}>
            <PlusIcon style={iconStyle} />
          </Button>
        )}
      </Stack>
    );
  }
};
