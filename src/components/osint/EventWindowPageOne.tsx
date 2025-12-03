import React from 'react';
import { Box, ScrollArea, Divider } from '@mantine/core';
import type { V1Event, V1RelatedEntity } from '@omnsight/clients/dist/geovision/geovision.js';
import { PersonList } from './entities/PersonEntity';
import { OrganizationList } from './entities/OrganizationEntity';
import { WebsiteList } from './entities/WebsiteEntity';
import { SourceList } from './entities/SourceEntity';
import { EventEntity } from './entities/EventEntity';

interface EventWindowPageOneProps {
  event: V1Event;
  relatedEntities: V1RelatedEntity[];
  onNavigate: (entity: V1RelatedEntity) => void;
  onCreate: (entity: V1RelatedEntity) => void;
}

export const EventWindowPageOne: React.FC<EventWindowPageOneProps> = ({
  event,
  relatedEntities,
  onNavigate,
  onCreate
}) => {
  // Filter entities
  const personEntities = relatedEntities.filter(e => e.person);
  const orgEntities = relatedEntities.filter(e => e.organization);
  const websiteEntities = relatedEntities.filter(e => e.website);
  const sourceEntities = relatedEntities.filter(e => e.source);

  return (
    <>
      {/* A. SCROLLABLE BODY */}
      <ScrollArea h="100%" type="scroll" offsetScrollbars>
        <Box p="lg" pb={100}> 

          {/* Section 1: Event Description & Location */}
          <EventEntity event={event} />

          <Divider my="sm" />

          {/* Section 2: Other Entities (Overflow) */}

          {/* Organizations */}
          <OrganizationList 
            items={orgEntities} 
            onSelect={onNavigate} 
            onCreate={onCreate} 
          />

           {/* Websites */}
           <WebsiteList 
             items={websiteEntities} 
             onSelect={onNavigate} 
             onCreate={onCreate} 
           />

          {/* Full Sources List */}
          <SourceList 
            items={sourceEntities} 
            onSelect={onNavigate} 
            onCreate={onCreate}
            variant="default"
          />
        </Box>
      </ScrollArea>

      {/* B. STICKY BOTTOM LEFT: PERSONS */}
      <Box style={{ position: 'absolute', bottom: 15, left: 15, zIndex: 10 }}>
        <PersonList 
          items={personEntities} 
          onSelect={onNavigate} 
          onCreate={onCreate}
          variant="avatar-group" 
        />
      </Box>

      {/* C. FLYOUT TOP RIGHT: SOURCES */}
      <Box style={{ position: 'absolute', top: 15, right: 15, zIndex: 10 }}>
        <SourceList 
          items={sourceEntities} 
          onSelect={onNavigate} 
          onCreate={onCreate}
          variant="popover" 
        />
      </Box>
    </>
  );
};