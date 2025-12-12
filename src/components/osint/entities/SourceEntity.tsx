import React, { useState } from 'react';
import { Group, Text, ActionIcon, Stack, Box, TextInput, NumberInput, Popover, Tooltip, rem, Avatar, Button, TagsInput, Badge, HoverCard } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { PlusIcon, LinkIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/solid';
import type { V1RelatedEntity, V1Source, V1Relation } from '@omnsight/clients/dist/geovision/geovision.js';
import { RelationTooltip } from './RelationEntity';
import './EntityStyles.css';

const iconStyle = { width: rem(18), height: rem(18) };
const lgIconStyle = { width: rem(24), height: rem(24) };

const defaultRenderSourceTooltip = (data: V1Source, relation?: V1Relation) => (
  <RelationTooltip relation={relation}>
    <SourceCard data={data} edit={false} />
  </RelationTooltip>
);

// --- CARD COMPONENT ---
interface SourceCardProps {
  data?: V1Source;
  edit: boolean;
  onChange?: (data: Partial<V1Source>) => void;
}

export const SourceCard: React.FC<SourceCardProps> = ({ data, edit, onChange }) => {
  const { t } = useTranslation();

  if (!edit) {
    return (
      <Box>
        <Group>
          <Text size="sm">{t('common.title')}:</Text>
          <Text c="blue" component="a" href={data?.url} target="_blank">
            {data?.name || data?.url}
          </Text>
        </Group>
        <Text size="sm">{t('source.reliability')}: {data?.reliability}%</Text>
        {data?.tags && data.tags.length > 0 && (
          <Group gap={4} mt="xs">
            {data.tags.map(tag => <Badge key={tag} size="sm" variant="outline">{tag}</Badge>)}
          </Group>
        )}
      </Box>
    );
  } else {
    return (
      <Stack>
        <TextInput label={t('common.name')} placeholder={t('common.enterName')} defaultValue={data?.name} onChange={e => onChange?.({ name: e.target.value })} />
        <TextInput label="URL" placeholder={t('common.enterUrl')} defaultValue={data?.url} onChange={e => onChange?.({ url: e.target.value })} />
        <NumberInput label={t('source.reliability')} placeholder={t('common.enterReliability')} defaultValue={data?.reliability} max={100} min={0} onChange={val => onChange?.({ reliability: Number(val) })} />
        <TagsInput
          label={t('common.tags')}
          placeholder={t('common.enterTags')}
          defaultValue={data?.tags}
          onChange={(tags) => onChange?.({ tags })}
        />
      </Stack>
    );
  }
};

// -- AVATAR (Popover Avatar) --
interface SourceAvatarProps {
  data?: V1Source;
  relation?: V1Relation;
  edit: boolean;
  renderTooltip?: (data: V1Source, relation?: V1Relation) => React.ReactNode;
}

export const SourceAvatar: React.FC<SourceAvatarProps> = ({ data, relation, edit, renderTooltip = defaultRenderSourceTooltip }) => {
  if (data) {
    return (
      <HoverCard
        key={data.id}
        width={400}
        position="left"
        withArrow
        shadow="md"
        withinPortal
      >
        <HoverCard.Target>
          <Avatar
            component={data.url ? "a" : "div"}
            href={data.url}
            target="_blank"
            className="entity-avatar"
            size="md"
            radius="xl"
            color="indigo"
            style={{ cursor: edit ? 'pointer' : 'default' }}
          >
            <LinkIcon style={{ width: '50%', height: '50%' }} />
          </Avatar>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          {renderTooltip(data, relation)}
        </HoverCard.Dropdown>
      </HoverCard>
    );
  } else {
    const { t } = useTranslation();
    return (
      <Tooltip label={t('source.unassociated')} withArrow>
        <Avatar size="md" radius="xl" color="gray" variant="light">
          <XMarkIcon style={{ width: '50%', height: '50%' }} />
        </Avatar>
      </Tooltip>
    );
  }
};

// -- ROW COMPONENT (For Full Avatar List) --
interface SourceRowProps {
  data?: V1Source;
  relation?: V1Relation;
  readOnly: boolean;
  onSelect: () => void;
  renderTooltip?: (data: V1Source, relation?: V1Relation) => React.ReactNode;
}

export const SourceRow: React.FC<SourceRowProps> = ({ data, relation, readOnly, onSelect, renderTooltip = defaultRenderSourceTooltip }) => {
  if (!data) return null;

  return (
    <Group wrap="nowrap" gap={0}>
      <HoverCard
        width={300}
        openDelay={500}
        withArrow
        shadow="md"
        disabled={!readOnly}
      >
        <HoverCard.Target>
          <Text
            size="sm"
            fw={500}
            style={{ cursor: readOnly ? 'default' : 'pointer' }}
            onClick={() => !readOnly && onSelect()}
            truncate="end"
          >
            {data.name || data.url}
          </Text>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          {renderTooltip(data, relation)}
        </HoverCard.Dropdown>
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
          <LinkIcon style={iconStyle} />
        </ActionIcon>
      )}
    </Group>
  );
};

// --- LIST COMPONENT ---
interface SourceListProps {
  items: V1RelatedEntity[];
  readOnly?: boolean;
  variant: 'card' | 'popover' | 'avatar';
  onSelect: (entity: V1RelatedEntity) => void;
  onCreate: (entity: V1RelatedEntity) => void;
}

export const SourceList: React.FC<SourceListProps> = ({ items, onSelect, onCreate, variant = 'avatar', readOnly = false }) => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);

  if (variant === 'popover') {
    return (
      <Popover opened={opened} onChange={setOpened} position="bottom" withArrow shadow="md" width={60} withinPortal>
        <Popover.Target>
          <ActionIcon variant="light" color="blue" size="lg" radius="xl" onClick={() => setOpened((o) => !o)}>
            {opened ? <ChevronDownIcon style={lgIconStyle} /> : <LinkIcon style={lgIconStyle} />}
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown style={{ padding: 5, backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}>
          <Stack gap={8} style={{ backgroundColor: 'transparent', padding: 5 }}>
            {items.map(rel => (
              <SourceAvatar
                key={rel.source?.id}
                data={rel.source}
                relation={rel.relation}
                edit={!readOnly}
              />
            ))}
          </Stack>
        </Popover.Dropdown>
      </Popover>
    );
  } else if (variant === 'avatar') {
    return (
      <Box mb="xl">
        <Group mb="sm">
          <Text fw={600}>{t('source.relatedSources')}</Text>
          {!readOnly && (
            <ActionIcon variant="subtle" size="sm" onClick={() => onCreate({ source: {}, relation: {} })}>
              <PlusIcon style={iconStyle} />
            </ActionIcon>
          )}
        </Group>
        <Stack gap="sm">
          {items.length === 0 ? (
            <Text c="dimmed" size="sm" fs="italic">{t('source.notFound')}</Text>
          ) : (
            items.map(rel => (
              <SourceRow
                key={rel.source?.id}
                data={rel.source}
                relation={rel.relation}
                readOnly={readOnly}
                onSelect={() => onSelect(rel)}
              />
            ))
          )}
        </Stack>
      </Box>
    );
  } else {
    return (
      <Stack gap="xs">
        {items.slice(0, 4).map(rel => <SourceCard key={rel.source?.id} data={rel.source} edit={!readOnly} />)}
        {!readOnly && (
          <Button fullWidth onClick={() => onCreate({ source: {}, relation: {} })}>
            <PlusIcon style={iconStyle} />
          </Button>
        )}
      </Stack>
    );
  }
};
