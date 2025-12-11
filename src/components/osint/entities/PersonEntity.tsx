import React from 'react';
import { Avatar, Tooltip, Stack, TextInput, Text, rem, Group, Badge, Button, Box, TagsInput, HoverCard } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { DateInput } from '@mantine/dates';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import type { V1Person, V1RelatedEntity, V1Relation } from '@omnsight/clients/dist/geovision/geovision.js';
import { RelationTooltip } from './RelationEntity';

const iconStyle = { width: rem(18), height: rem(18) };

import './EntityStyles.css';

const defaultRenderPersonTooltip = (data: V1Person, relation?: V1Relation) => (
  <RelationTooltip relation={relation}>
    <PersonCard data={data} edit={false} />
  </RelationTooltip>
);

// --- CARD ---
interface PersonCardProps {
  data?: V1Person;
  edit: boolean;
  onChange?: (data: Partial<V1Person>) => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({ data, edit, onChange }) => {
  const { t } = useTranslation();
  
  if (edit) {
    return (
      <Stack>
        <TextInput label={t('common.name')} defaultValue={data?.name} placeholder={t('person.namePlaceholder')} onChange={e => onChange?.({ name: e.target.value })} />
        <TextInput label={t('common.role')} defaultValue={data?.role} placeholder={t('person.rolePlaceholder')} onChange={e => onChange?.({ role: e.target.value })} />
        <TextInput label={t('common.nationality')} defaultValue={data?.nationality} onChange={e => onChange?.({ nationality: e.target.value })} />
        <DateInput
          label={t('person.birthDate')}
          value={data?.birthDate ? new Date(parseInt(data.birthDate)) : null}
          onChange={(date: any) => onChange?.({ birthDate: date ? new Date(date).getTime().toString() : undefined })}
        />
        <TagsInput
          label={t('common.tags')}
          defaultValue={data?.tags}
          onChange={(tags) => onChange?.({ tags })}
        />
        <TagsInput
          label={t('person.aliases')}
          defaultValue={data?.aliases}
          onChange={(aliases) => onChange?.({ aliases })}
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
        <Text size="xl" fw={700}>{data?.name}</Text>
        <Text>{t('common.role')}: {data?.role}</Text>
        <Text>{t('common.nationality')}: {data?.nationality}</Text>
        {data?.birthDate && <Text size="sm" c="dimmed">{t('person.birthDate')}: {formatDate(data.birthDate)}</Text>}
        {data?.tags && data.tags.length > 0 && (
          <Group gap={4}>
            <Text size="sm">{t('common.tags')}:</Text>
            {data.tags.map(tag => <Badge key={tag} size="sm" variant="outline">{tag}</Badge>)}
          </Group>
        )}
        {data?.aliases && data.aliases.length > 0 && (
          <Group gap={4}>
            <Text size="sm">{t('person.aliases')}:</Text>
            {data.aliases.map(alias => <Badge key={alias} size="sm" color="gray">{alias}</Badge>)}
          </Group>
        )}
      </Stack>
    );
  }
};

// -- AVATAR --
interface PersonAvatarProps {
  data?: V1Person;
  relation?: V1Relation;
  edit: boolean;
  onClick?: () => void;
  renderTooltip?: (data: V1Person, relation?: V1Relation) => React.ReactNode;
}

export const PersonAvatar: React.FC<PersonAvatarProps> = ({ data, relation, edit, onClick, renderTooltip = defaultRenderPersonTooltip }) => {
  const { t } = useTranslation();
  if (data) {
    return (
      <HoverCard
        key={data.id}
        width={300}
        position="top"
        withArrow
        shadow="md"
        withinPortal
      >
        <HoverCard.Target>
          <Avatar
            src={null}
            alt={data.name}
            radius="xl"
            size="md"
            color="indigo"
            style={{ cursor: edit ? 'pointer' : 'default', border: '2px solid white' }}
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
      <Tooltip label={t('person.notFound')} withArrow>
        <Avatar size="md" radius="xl" color="gray" variant="light">
          <XMarkIcon style={{ width: '50%', height: '50%' }} />
        </Avatar>
      </Tooltip>
    );
  }
};

// --- LIST COMPONENT ---
interface PersonListProps {
  items: V1RelatedEntity[];
  readOnly?: boolean;
  variant: 'avatar' | 'card';
  onSelect: (entity: V1RelatedEntity) => void;
  onCreate: (entity: V1RelatedEntity) => void;
}

export const PersonList: React.FC<PersonListProps> = ({ items, onSelect, onCreate, readOnly = false, variant }) => {
  if (variant === 'avatar') {
    return (
      <Box mb="xl">
        <Avatar.Group>
          {items.length === 0 ? (
            <PersonAvatar edit={false} onClick={() => { }} />
          ) : (
            items.slice(0, 4).map(rel => <PersonAvatar key={rel.person?.id} data={rel.person} relation={rel.relation} edit={!readOnly} onClick={() => !readOnly && onSelect(rel)} />)
          )}
          {!readOnly && (
            <Avatar key='newperson' size="md" radius="xl" color="indigo" style={{ cursor: 'pointer', border: '2px solid white' }} onClick={() => onCreate({ person: {}, relation: {} })}>
              <PlusIcon style={{ width: '50%', height: '50%' }} />
            </Avatar>
          )}
        </Avatar.Group>
      </Box>
    );
  } else {
    return (
      <Stack gap="xs">
        {items.slice(0, 4).map(rel => <PersonCard data={rel.person} edit={!readOnly} />)}
        {/* Create Button */}
        {!readOnly && (
          <Button fullWidth onClick={() => onCreate({ person: {}, relation: {} })}>
            <PlusIcon style={iconStyle} />
          </Button>
        )}
      </Stack>
    );
  }
};
