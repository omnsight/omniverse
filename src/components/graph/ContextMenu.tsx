import React from 'react';
import { Menu, rem } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import {
  UserIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  GlobeAltIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/solid';
import type { Entity } from '../models/entity';

interface GraphContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onCreate: (entity: Entity) => void;
  hasWritePermission: boolean;
}

export const GraphContextMenu: React.FC<GraphContextMenuProps> = ({
  x,
  y,
  onClose,
  onCreate,
  hasWritePermission,
}) => {
  const { t } = useTranslation();

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
              onClick={() => {
                onCreate({ type: 'Person', data: {} });
                onClose();
              }}
            >
              {t('entity.person.type', 'Person')}
            </Menu.Item>
          )}

          {hasWritePermission && (
            <Menu.Item
              leftSection={<BuildingOfficeIcon style={{ width: rem(16), height: rem(16) }} />}
              onClick={() => {
                onCreate({ type: 'Organization', data: {} });
                onClose();
              }}
            >
              {t('entity.organization.type', 'Organization')}
            </Menu.Item>
          )}

          {hasWritePermission && (
            <Menu.Item
              leftSection={<CalendarDaysIcon style={{ width: rem(16), height: rem(16) }} />}
              onClick={() => {
                onCreate({ type: 'Event', data: {} });
                onClose();
              }}
            >
              {t('entity.event.type', 'Event')}
            </Menu.Item>
          )}

          {hasWritePermission && (
            <Menu.Item
              leftSection={<GlobeAltIcon style={{ width: rem(16), height: rem(16) }} />}
              onClick={() => {
                onCreate({ type: 'Website', data: {} });
                onClose();
              }}
            >
              {t('entity.website.type', 'Website')}
            </Menu.Item>
          )}

          {hasWritePermission && (
            <Menu.Item
              leftSection={<DocumentTextIcon style={{ width: rem(16), height: rem(16) }} />}
              onClick={() => {
                onCreate({ type: 'Source', data: {} });
                onClose();
              }}
            >
              {t('entity.source.type', 'Source')}
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
