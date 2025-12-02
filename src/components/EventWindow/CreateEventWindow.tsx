import { useReducer } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X } from 'lucide-react';
import type { V1Event } from '@omnsight/clients/dist/omnibasement/omnibasement';
import { EventForm } from './EventForm';

const INITIAL_EVENT_STATE: V1Event = {
  title: '',
  description: '',
  happenedAt: '0', 
  tags: [],
  roles: [],
  location: {
    latitude: 0,
    longitude: 0,
    countryCode: '',
    administrativeArea: '',
    subAdministrativeArea: '',
    locality: '',
    subLocality: '',
    address: '',
    postalCode: 0,
  }
};

interface CreateEventWindowProps {
  onClose: () => void;
}

export const CreateEventWindow = ({ onClose }: CreateEventWindowProps) => {
  const { baseApi, addEvent } = useAppStore();
  const [newEvent, updateNewEvent] = useReducer(
    (prev: V1Event, next: Partial<V1Event> | null) => {
      if (next === null) {
        return INITIAL_EVENT_STATE;
      }
      return { ...prev, ...next };
    },
    INITIAL_EVENT_STATE
  );

  const handleClose = () => {
    onClose();
    updateNewEvent(null);
  };

  const createEvent = async () => {
    try {
      const response = await baseApi.v1.eventServiceCreateEvent(newEvent);

      if (response.data.event) {
        addEvent(response.data.event);
        handleClose();
      } else {
        console.log('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
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
            event={newEvent}
            updateEvent={updateNewEvent}
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-slate-600 text-slate-300 rounded hover:bg-slate-700 transition"
            >
              取消
            </button>
            <button
              onClick={createEvent}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              创建
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}