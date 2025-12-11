import React, { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import type { V1Event, V1RelatedEntity } from '@omnsight/clients/dist/geovision/geovision.js';
import { EventWindowPageOne } from './EventWindowPageOne';
import { EventWindowPageTwo, type PageTwoContext } from './EventWindowPageTwo';
import { useGeoApi } from '../../utilties/useGeoApi';
import { useQuery } from '@tanstack/react-query';
import { WindowModal, type WindowBreadcrumb } from './WindowModal';

interface EventWindowProps {
  isOpen: boolean;
  onClose: () => void;
  event: V1Event;
}

export const EventWindow: React.FC<EventWindowProps> = ({ isOpen, onClose, event }) => {
  const api = useGeoApi();

  const [pageTwo, setPageTwo] = useState<PageTwoContext | null>(null);

  const { data, error, isLoading } = useQuery({
    queryKey: ['event-related-entities', event.key],
    queryFn: async () => {
      const res = await api.v1.geoServiceGetEventRelatedEntities(event.key!);
      return res.data;
    },
    enabled: !!event.key && isOpen,
    retry: 1,
  });

  useEffect(() => {
    if (error) {
      notifications.show({
        title: '错误',
        message: '无法加载事件详情，请稍后重试。',
        color: 'red',
      });
      onClose();
    }
  }, [error, onClose]);

  // Helper to get display name for breadcrumbs
  const getEntityName = (entity: V1RelatedEntity) => {
    return entity.person?.name || entity.organization?.name || entity.source?.name || entity.website?.domain || '新实体';
  };

  const breadcrumbs: WindowBreadcrumb[] = [
    {
      label: event.title || '无标题事件',
      onClick: () => setPageTwo(null),
    }
  ];

  if (pageTwo) {
    breadcrumbs.push({
      label: getEntityName(pageTwo.entity),
    });
  }

  return (
    <WindowModal
      opened={isOpen}
      onClose={onClose}
      isLoading={isLoading}
      breadcrumbs={breadcrumbs}
      onBack={pageTwo ? () => setPageTwo(null) : undefined}
    >
      {!pageTwo ? (
          <EventWindowPageOne
            event={event}
            relatedEntities={data?.entities || []}
            onNavigate={(relatedEntity) => setPageTwo({ entity: relatedEntity, create: false })}
            onCreate={(newEntity) => setPageTwo({ entity: newEntity, create: true })}
          />
        ) : (
          <EventWindowPageTwo context={pageTwo} onSave={() => setPageTwo(null)} />
        )}
    </WindowModal>
  );
};