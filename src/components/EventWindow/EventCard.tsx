import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '../../store/useAppStore';
import { X } from 'lucide-react';
import type { V1Event } from '@omnsight/clients/dist/omnibasement/omnibasement';
import { EventForm } from './EventForm';

interface EventWindowProps {
  eventData: V1Event;
  onClose: () => void;
}

export const EventWindow = ({ eventData, onClose }: EventWindowProps) => {
  const { baseApi, events, relations, setEvents } = useAppStore();
  const [event, setEvent] = useState<V1Event>(eventData);

  const handleClose = () => {
    const updatedEvents = events.map(e => 
      e.id === event.id ? event : e
    );
    setEvents(updatedEvents, relations);
    onClose();
  };

  const updateEvent = async (updater: Partial<V1Event>) => {
    try {
      if (!event.key) {
        throw new Error('Event key is not defined');
      }

      const response = await baseApi.v1.eventServiceUpdateEvent(event.key, {
        ...event,
        ...updater,
      });

      if (response.data.event) {
        setEvent(response.data.event);
      } else {
        toast.error('未能更新事件！请稍后重试');
      }
    } catch (error) {
      toast.error('遇到未知错误！请稍后重试');
      handleClose();
      console.error('Error updating event:', error);
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
      <div className="bg-slate-800 rounded-lg w-1/2 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">添加新事件</h3>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          <EventForm
            event={event}
            updateEvent={updateEvent}
          />

        </div>
      </div>
    </div>
  );
}
