import type { V1Event } from '@omnsight/clients/dist/omnibasement/omnibasement';
import { X } from 'lucide-react';
import { useState } from 'react';

interface EventFormProps {
  event: V1Event;
  updateEvent: (event: Partial<V1Event>) => void;
}

export const EventForm = ({event, updateEvent}: EventFormProps) => {
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !event.tags?.includes(tagInput.trim())) {
      updateEvent({
        tags: [...event.tags || [], tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!event.tags) {
      return;
    }
    updateEvent({
      tags: event.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
        <input
          type="text"
          value={event.title}
          onChange={(e) => updateEvent({ title: e.target.value })}
          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Event title"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
        <textarea
          value={event.description}
          onChange={(e) => updateEvent({ description: e.target.value })}
          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Event description"
          rows={3}
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
        <input
          type="date"
          value={event.happenedAt}
          onChange={(e) => updateEvent({ happenedAt: e.target.value })}
          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Tags</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a tag and press Enter"
          />
          <button
            onClick={handleAddTag}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {event.tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-900 text-blue-100 px-2 py-1 rounded-full text-sm flex items-center"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-blue-300 hover:text-white"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Location Section */}
    </div>
  );
};