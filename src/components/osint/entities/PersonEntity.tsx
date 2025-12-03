import React from 'react';
import { Avatar, Tooltip, Stack, TextInput, Text, Group, rem } from '@mantine/core';
import { PlusIcon } from '@heroicons/react/24/solid';
import type { V1Person, V1RelatedEntity } from '@omnsight/clients/dist/geovision/geovision.js';

const iconStyle = { width: rem(18), height: rem(18) };

// --- PROPS ---
interface PersonListProps {
  items: V1RelatedEntity[];
  onSelect: (entity: V1RelatedEntity) => void;
  onCreate: (entity: V1RelatedEntity) => void;
  variant?: 'default' | 'avatar-group';
}

interface PersonCardProps {
  data: V1Person;
  edit: boolean;
  onChange?: (data: V1Person) => void; // Not fully implemented for deep editing yet
}

// --- LIST COMPONENT ---
export const PersonList: React.FC<PersonListProps> = ({ items, onSelect, onCreate, variant = 'default' }) => {
  if (variant === 'avatar-group') {
    return (
      <Avatar.Group>
        {items.slice(0, 4).map(rel => {
          const person = rel.person!;
          return (
            <Tooltip key={person.id} label={person.name} withArrow>
              <Avatar 
                src={null} 
                alt={person.name} 
                radius="xl" 
                size="md" 
                color="indigo"
                onClick={() => onSelect(rel)}
                style={{ cursor: 'pointer', border: '2px solid white' }}
              >
                {person.name?.[0]}
              </Avatar>
            </Tooltip>
          );
        })}
        {/* Create Button */}
        <Avatar radius="xl" size="md" color="gray" onClick={() => onCreate({ person: {}, relation: {} })} style={{ cursor: 'pointer' }}>
          <PlusIcon style={iconStyle} />
        </Avatar>
      </Avatar.Group>
    );
  }

  // Default List Variant
  return (
    <Stack gap="xs">
        {items.map(rel => {
             const person = rel.person!;
             return (
                 <Group key={person.id} onClick={() => onSelect(rel)} style={{ cursor: 'pointer' }}>
                     <Avatar size="sm" color="indigo" radius="xl">{person.name?.[0]}</Avatar>
                     <Text size="sm">{person.name}</Text>
                 </Group>
             )
        })}
        <Group style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => onCreate({ person: {}, relation: {} })}>
            <Avatar size="sm" color="gray" radius="xl"><PlusIcon style={{ width: 12, height: 12 }} /></Avatar>
            <Text size="sm">Add Person</Text>
        </Group>
    </Stack>
  );
};

// --- CARD COMPONENT ---
export const PersonCard: React.FC<PersonCardProps> = ({ data, edit }) => {
  if (edit) {
    return (
      <Stack>
        <TextInput label="Name" defaultValue={data.name} placeholder="John Doe" />
        <TextInput label="Role" defaultValue={data.role} placeholder="Witness, Suspect..." />
        <TextInput label="Nationality" defaultValue={data.nationality} />
      </Stack>
    );
  } else {
    return (
      <Stack gap="xs">
        <Text size="xl" fw={700}>{data.name}</Text>
        <Text>Role: {data.role}</Text>
        <Text>Nationality: {data.nationality}</Text>
      </Stack>
    );
  }
};
