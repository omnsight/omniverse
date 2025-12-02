import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Plus } from 'lucide-react';
import { CreateEventWindow } from '../components/EventWindow/CreateEventWindow';
import { EventMap } from '../components/EventMap';
import type { V1Event } from '@omnsight/clients/dist/omnibasement/omnibasement';
import { EventWindow } from '../components/EventWindow/EventCard';

export const AdminPanel = () => {
  const { events, relations, theme } = useAppStore();
  const [createOn, setCreateOn] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<V1Event | undefined>(undefined);

  const handleSelectEvent = (event: V1Event) => {
    setSelectedEvent(event);
    setCreateOn(false);
  };

  return (
    <div className="flex h-full w-full">
      {/* Left Feed */}
      <div className="w-2/5 h-full bg-slate-900 border-r border-slate-800 overflow-y-auto">
        <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <h2 className="text-lg font-bold text-white">事件列表</h2>
          <div className="text-xs text-slate-400">事件总数:{events.length}</div>
        </div>

        <div className="space-y-0 divider-y divider-slate-800">
          {events.map(event => (
            <div key={event.id} className="p-4 hover:bg-slate-800 border-b border-slate-800/50 cursor-pointer group">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono text-blue-400">
                  {new Date(parseInt(event.happenedAt || '0')).toLocaleDateString()}
                </span>
                {/* Role Tags */}
                <div className="flex gap-1">
                  {event.roles?.map(role => (
                    <span key={role} className="text-[10px] bg-slate-700 text-slate-300 px-1 rounded">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="text-slate-200 font-medium mt-1">{event.title}</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{event.description}</p>
            </div>
          ))}
        </div>

        {/* Floating Add Button */}
        <button 
          onClick={() => setCreateOn(true)}
          className="absolute bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-10"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Right Map */}
      <div className="w-3/5 h-full bg-black relative">
        <EventMap events={events} relations={relations} theme={theme} selectEvent={handleSelectEvent}/>

        {/* Create Event Modal */}
        {createOn && <CreateEventWindow onClose={() => setCreateOn(false)} />}
        {selectedEvent && <EventWindow eventData={selectedEvent} onClose={() => setSelectedEvent(undefined)} />}
      </div>
    </div>
  );
};