import React from 'react';
import { ScrollArea, Paper } from '@mantine/core';
import { useLocalDataState } from '../../store/localData';
import { useSelection } from '../../store/selection';

import { EventCard } from '../entity/event/Card';
import { PersonCard } from '../entity/person/Card';
import { OrganizationCard } from '../entity/organization/Card';
import { WebsiteCard } from '../entity/website/Card';
import { SourceCard } from '../entity/source/Card';
import { RelationCard } from '../entity/relation/Card';

export const SelectedNodePanel: React.FC = () => {
  const selectedIds = useSelection((state) => state.selectedIds);
  const localData = useLocalDataState();

  if (selectedIds.length === 0) {
    return null;
  }

  const selectedId = selectedIds[selectedIds.length - 1];
  let content = null;
  if (localData.events.has(selectedId)) {
    content = <EventCard event={localData.events.get(selectedId)!} withTitle width="100%" />;
  } else if (localData.persons.has(selectedId)) {
    content = <PersonCard data={localData.persons.get(selectedId)!} />;
  } else if (localData.organizations.has(selectedId)) {
    content = <OrganizationCard data={localData.organizations.get(selectedId)!} />;
  } else if (localData.websites.has(selectedId)) {
    content = <WebsiteCard data={localData.websites.get(selectedId)!} />;
  } else if (localData.sources.has(selectedId)) {
    content = <SourceCard data={localData.sources.get(selectedId)!} />;
  } else if (localData.relations.has(selectedId)) {
    content = <RelationCard data={localData.relations.get(selectedId)!} />;
  }

  return (
    <Paper shadow="sm" radius="md" withBorder>
      <ScrollArea h="20vh" w="400px" p="md">
        {content}
      </ScrollArea>
    </Paper>
  );
};
