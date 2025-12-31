import React from 'react';
import { Menu, rem } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useLocalDataActions } from '../../store/localData';
import {
  UserIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  GlobeAltIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/solid';
import type { V1Entity } from '@omnsight/clients/dist/omndapi/omndapi';
import { useAuth } from '../../provider/AuthContext';

// Helper to generate random ID
const generateId = () => `new${Math.random().toString(36).slice(2, 11)}`;

interface GraphContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export const GraphContextMenu: React.FC<GraphContextMenuProps> = ({ x, y, onClose }) => {
  const { user, hasRole } = useAuth();
  const { addEntities } = useLocalDataActions();
  const { t } = useTranslation();
  const hasWritePermission = user && (hasRole('admin') || hasRole('pro'));

  const create = (entity: V1Entity) => {
    addEntities([entity]);
    onClose();
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 999,
        }}
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />
      <Menu opened={true} onClose={onClose} shadow="md" width={200} zIndex={1000}>
        <Menu.Target>
          <div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0 }} />
        </Menu.Target>

        <Menu.Dropdown>
          {hasWritePermission && (
            <Menu.Label>{t('components.GraphContextMenu.create', 'Create New Entity')}</Menu.Label>
          )}

          {hasWritePermission && (
            <Menu.Item
              leftSection={<UserIcon style={{ width: rem(16), height: rem(16) }} />}
              onClick={() => create({ person: { id: generateId(), owner: user.id } })}
            >
              {t('entity.person.type', 'Person')}
            </Menu.Item>
          )}

          {hasWritePermission && (
            <Menu.Item
              leftSection={<BuildingOfficeIcon style={{ width: rem(16), height: rem(16) }} />}
              onClick={() =>
                create({
                  organization: {
                    id: generateId(),
                    owner: user.id,
                  },
                })
              }
            >
              {t('entity.organization.type', 'Organization')}
            </Menu.Item>
          )}

          {hasWritePermission && (
            <Menu.Item
              leftSection={<CalendarDaysIcon style={{ width: rem(16), height: rem(16) }} />}
              onClick={() => create({ event: { id: generateId(), owner: user.id } })}
            >
              {t('entity.event.type', 'Event')}
            </Menu.Item>
          )}

          {hasWritePermission && (
            <Menu.Item
              leftSection={<GlobeAltIcon style={{ width: rem(16), height: rem(16) }} />}
              onClick={() =>
                create({
                  website: { id: generateId(), owner: user.id },
                })
              }
            >
              {t('entity.website.type', 'Website')}
            </Menu.Item>
          )}

          {hasWritePermission && (
            <Menu.Item
              leftSection={<DocumentTextIcon style={{ width: rem(16), height: rem(16) }} />}
              onClick={() => create({ source: { id: generateId(), owner: user.id } })}
            >
              {t('entity.source.type', 'Source')}
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
