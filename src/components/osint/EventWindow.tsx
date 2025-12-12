import React, { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import type { V1Event, V1RelatedEntity } from '@omnsight/clients/dist/geovision/geovision.js';
import { EventWindowPageOne } from './EventWindowPageOne';
import { EventWindowPageTwo, type PageTwoContext } from './EventWindowPageTwo';
import { useGeoApi } from '../../utilties/useGeoApi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { WindowModal, type WindowBreadcrumb } from './WindowModal';
import { useBaseApi } from '../../utilties/useBaseApi';

interface EventWindowProps {
  isOpen: boolean;
  onClose: () => void;
  event: V1Event;
}

export const EventWindow: React.FC<EventWindowProps> = ({ isOpen, onClose, event }) => {
  const { t } = useTranslation();
  const geoApi = useGeoApi();
  const baseApi = useBaseApi();
  const queryClient = useQueryClient();

  const [pageTwo, setPageTwo] = useState<PageTwoContext | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data, error, isLoading } = useQuery({
    queryKey: ['event-related-entities', event.key],
    queryFn: async () => {
      const res = await geoApi.v1.geoServiceGetEventRelatedEntities(event.key!);
      return res.data;
    },
    enabled: !!event.key && isOpen,
    retry: 1,
  });

  useEffect(() => {
    if (error) {
      notifications.show({
        title: t('common.error'),
        message: t('event.loadError'),
        color: 'red',
      });
      onClose();
    }
  }, [error, onClose, t]);

  const onEntityUpdate = async (entity: V1RelatedEntity) => {
    try {
      let entityId: string | undefined;

      if (pageTwo?.create) {
        if (entity.person) {
          const res = await baseApi.v1.personServiceCreatePerson(entity.person!);
          entityId = res.data.person?.id;
        } else if (entity.organization) {
          const res = await baseApi.v1.organizationServiceCreateOrganization(entity.organization!);
          entityId = res.data.organization?.id;
        } else if (entity.website) {
          const res = await baseApi.v1.websiteServiceCreateWebsite(entity.website!);
          entityId = res.data.website?.id;
        } else if (entity.source) {
          const res = await baseApi.v1.sourceServiceCreateSource(entity.source!);
          entityId = res.data.source?.id;
        }

        if (entityId && entity.relation) {
          await baseApi.v1.relationshipServiceCreateRelationship({
            ...entity.relation,
            from: event.id!,
            to: entityId,
          });
        }
      } else {
        if (entity.person) {
          await baseApi.v1.personServiceUpdatePerson(entity.person.key!, entity.person);
        } else if (entity.organization) {
          await baseApi.v1.organizationServiceUpdateOrganization(entity.organization.key!, entity.organization);
        } else if (entity.website) {
          await baseApi.v1.websiteServiceUpdateWebsite(entity.website.key!, entity.website);
        } else if (entity.source) {
          await baseApi.v1.sourceServiceUpdateSource(entity.source.key!, entity.source);
        }

        if (entity.relation) {
          const [collection, key] = entity.relation.id!.split('/');
          await baseApi.v1.relationshipServiceUpdateRelationship(collection, key, entity.relation!);
        }
      }

      notifications.show({
        title: t('common.success'),
        message: pageTwo?.create ? t('common.entityCreated') : t('common.entityUpdated'),
        color: 'green',
      });

      queryClient.invalidateQueries({ queryKey: ['event-related-entities', event.key] });
      setPageTwo(null);
    } catch (e) {
      console.error(e);
      notifications.show({
        title: t('common.error'),
        message: t('common.error'),
        color: 'red',
      });
    }
  };

  const getEntityName = (entity: V1RelatedEntity) => {
    if (pageTwo?.create) {
      if (entity.person) return t('common.eventwindow.createPerson');
      if (entity.organization) return t('common.eventwindow.createOrganization');
      if (entity.website) return t('common.eventwindow.createWebsite');
      if (entity.source) return t('common.eventwindow.createSource');
    }
    return entity.person?.name || entity.organization?.name || entity.source?.name || entity.website?.domain || t('common.eventwindow.newEntity');
  };

  const breadcrumbs: WindowBreadcrumb[] = [
    {
      label: event.title || t('common.untitledEvent'),
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
            isEditMode={isEditMode}
            onEditModeChange={setIsEditMode}
          />
        ) : (
          <EventWindowPageTwo context={pageTwo} onSave={onEntityUpdate} />
        )}
    </WindowModal>
  );
};