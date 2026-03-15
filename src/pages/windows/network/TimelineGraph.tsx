import { useEffect, useState } from 'react';
import { type Node, type Edge } from 'reactflow';
import { type Event } from 'omni-osint-crud-client';
import { useEntityDataStore } from './entityData';
import { useSelectedEntities } from '../data/entitySelection';
import { ActionGraph } from './ActionedGraph';
import { Breadcrumbs, Anchor } from '@mantine/core';

const getTimelineLayout = (
  events: Event[],
  currentDate: Date,
  viewType: 'day' | 'month' | 'year',
) => {
  const HORIZONTAL_SPACING = 250;
  const VERTICAL_SPACING = 80;
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  const groups: Record<number, any[]> = {};

  events.forEach((event) => {
    const d = new Date(event.happened_at || 0);
    const eventYear = d.getFullYear();
    const eventMonth = d.getMonth();
    const eventDay = d.getDate();

    let isMatch = false;
    let unit = 0;

    if (viewType === 'day') {
      // Must be same Year, Month, and Day
      isMatch = eventYear === currentYear && eventMonth === currentMonth && eventDay === currentDay;
      unit = d.getHours();
    } else if (viewType === 'month') {
      // Must be same Year and Month
      isMatch = eventYear === currentYear && eventMonth === currentMonth;
      unit = eventDay; // 1-31
    } else if (viewType === 'year') {
      // Must be same Year
      isMatch = eventYear === currentYear;
      unit = eventMonth; // 0-11
    }

    if (isMatch) {
      if (!groups[unit]) groups[unit] = [];
      groups[unit].push(event);
    }
  });

  // 2. Map groups to Nodes
  return Object.entries(groups).flatMap(([unitStr, groupEvents]) => {
    const unit = parseInt(unitStr);
    const isEven = unit % 2 === 0;

    return groupEvents.map((event, index) => {
      const x = unit * HORIZONTAL_SPACING;

      const direction = isEven ? -1 : 1;
      const y = direction * (100 + index * VERTICAL_SPACING);

      return {
        id: event._id,
        type: 'event',
        data: event,
        position: { x, y },
        selected: false,
      };
    });
  });
};

export const TimelineGraph: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('day');
  const { events } = useEntityDataStore();
  const selections = useSelectedEntities();
  const date = new Date();

  useEffect(() => {
    const layoutNodes = getTimelineLayout(events, date, viewMode);
    layoutNodes.forEach((node) => {
      if (selections.some((s) => s.data._id === node.data._id)) {
        node.data.selected = true;
      }
    });

    const sectorLabels: Node[] = Array.from({ length: 24 }).map((_, i) => ({
      id: `sector-${i}`,
      type: 'group', // Using group as a visual container
      data: { label: `${i}:00` },
      position: { x: i * 250, y: -20 },
      style: { width: 200, height: 40, backgroundColor: 'rgba(0,0,0,0.05)', border: 'none' },
      draggable: false,
      selectable: false,
    }));

    setNodes([...sectorLabels, ...layoutNodes]);
  }, [events, date, viewMode]);

  const items = [
    { title: date.getFullYear(), onClick: () => setViewMode('year') },
    { title: date.getMonth() + 1, onClick: () => setViewMode('month') },
    { title: date.getDate(), onClick: () => setViewMode('day') },
  ].map((item, index) => (
    <Anchor key={index} onClick={item.onClick}>
      {item.title}
    </Anchor>
  ));

  return (
    <div style={{ width: '100%', height: '800px', position: 'relative' }}>
      <ActionGraph
        allowWrite={false}
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
      >
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 100 }}>
          <Breadcrumbs>{items}</Breadcrumbs>
        </div>
      </ActionGraph>
    </div>
  );
};
