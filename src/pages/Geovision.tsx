import { useAppStore } from '../store/useAppStore';
import { EventMap } from '../components/EventMap';
import { useState } from 'react';
import type { V1Event } from '@omnsight/clients/dist/omnibasement/omnibasement';
import { EventWindow } from '../components/EventWindow/EventCard';

export const Geovision = () => {
  const { events, relations, theme } = useAppStore();
  const [selectedEvent, setSelectedEvent] = useState<V1Event | undefined>(undefined);

  return (
    <div className="w-full h-full bg-slate-900">
      <EventMap
        events={events}
        relations={relations}
        theme={theme}
        selectEvent={setSelectedEvent}
      />
      {selectedEvent &&
        <EventWindow
          eventData={selectedEvent}
          onClose={() => setSelectedEvent(undefined)}
        />
      }
    </div>
  );
};