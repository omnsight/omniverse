import { useEffect, useReducer } from 'react';
import {
  Input,
  IconButton,
  Popover,
  PopoverHandler,
  PopoverContent,
  Typography,
  Button,
} from "@material-tailwind/react";
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon, 
  MapPinIcon, 
  CalendarDaysIcon 
} from "@heroicons/react/24/solid";
import { useAppStore } from '../store/useAppStore';

interface FilterState {
  searchQuery: string;
  country: string | null;
  adminArea: string | null;
  tags: string[];
  roleFilter: string[]; // For Admin Panel specific filtering
  timeRange: { start: number; end: number };
}

export const SearchModel = () => {
  const { geoApi, setEvents } = useAppStore();
  const [filters, updateFilters] = useReducer(
    (prev: FilterState, next: Partial<FilterState>) => {
      return { ...prev, ...next };
    },
    {
      searchQuery: "",
      country: null,
      adminArea: null,
      tags: [],
      roleFilter: [],
      timeRange: {
        start: new Date().setHours(0, 0, 0, 0),
        end: new Date().setHours(23, 59, 59, 999)
      },
    }
  );

  useEffect(() => {
    geoApi.v1.geoServiceGetEvents({
      startTime: filters.timeRange.start.toString(),
      endTime: filters.timeRange.end.toString(),
    }).then(res => {
      setEvents(res.data.events || [], res.data.relations || []);
    });
  }, [filters]);

  const handleDateChange = (type: 'start' | 'end', dateString: string) => {
    const timestamp = dateString ? new Date(dateString).getTime() : 0;
    updateFilters({
      timeRange: {
        ...filters.timeRange,
        [type]: timestamp
      }
    });
  };

  return (
    <div className="flex w-full max-w-3xl items-center gap-2 text-blue-gray-200">
      <div className="relative flex w-full gap-2">
        <Input
          type="search"
          label="Search events, entities..."
          value={filters.searchQuery}
          onChange={(e) => updateFilters({searchQuery: e.target.value})}
          className="!border-slate-700 text-white focus:!border-blue-500"
          labelProps={{ className: "text-slate-400" }}
          containerProps={{ className: "min-w-0" }}
          icon={<MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />}
          crossOrigin={undefined} // TS Fix
        />

        <Popover placement="bottom-end">
          <PopoverHandler>
            <IconButton variant="text" className="text-slate-400 hover:bg-slate-800 hover:text-white">
              <AdjustmentsHorizontalIcon className="h-5 w-5"/>
            </IconButton>
          </PopoverHandler>

          <PopoverContent className="w-96 border-slate-700 bg-slate-800 p-4 shadow-xl text-slate-200">
            <Typography variant="h6" color="white" className="mb-4">
              Advanced Filters
            </Typography>
            
            <div className="flex flex-col gap-4">
              {/* Location Group */}
              <div className="space-y-2">
                <Typography variant="small" className="flex items-center gap-1 font-bold text-slate-400">
                  <MapPinIcon className="h-3 w-3"/> LOCATION
                </Typography>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Country (e.g. US)"
                    className="!border-slate-600 text-white"
                    labelProps={{ className: "text-slate-400" }}
                    value={filters.country || ""}
                    onChange={(e) => updateFilters({country: e.target.value})}
                    crossOrigin={undefined}
                  />
                  <Input
                    label="State/Province"
                    className="!border-slate-600 text-white"
                    labelProps={{ className: "text-slate-400" }}
                    value={filters.adminArea || ""}
                    onChange={(e) => updateFilters({adminArea: e.target.value})}
                    crossOrigin={undefined}
                  />
                </div>
              </div>

              {/* Date Group */}
              <div className="space-y-2 border-t border-slate-700 pt-2">
                <Typography variant="small" className="flex items-center gap-1 font-bold text-slate-400">
                  <CalendarDaysIcon className="h-3 w-3"/> TIME RANGE
                </Typography>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="w-full rounded border border-slate-600 bg-slate-900 p-2 text-sm text-slate-200 outline-none focus:border-blue-500"
                    onChange={(e) => handleDateChange("start", e.target.value)}
                  />
                  <span className="text-slate-500">-</span>
                  <input
                    type="date"
                    className="w-full rounded border border-slate-600 bg-slate-900 p-2 text-sm text-slate-200 outline-none focus:border-blue-500"
                    onChange={(e) => handleDateChange("end", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Button
        variant="outlined"
        size="sm"
        className="hidden border-slate-700 text-slate-300 hover:bg-slate-800 sm:flex"
      >
        {filters.timeRange.start ? "Custom Date" : "All Time"}
      </Button>
    </div>
  );
};