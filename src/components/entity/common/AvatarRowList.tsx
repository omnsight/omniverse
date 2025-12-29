import React from 'react';
import { Avatar, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface Props {
  children: React.ReactNode[];
}

export const AvatarRowList: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <Avatar.Group>
      {children.length === 0 ? (
        <Text c="dimmed" size="sm" fs="italic">
          {t('common.notFound')}
        </Text>
      ) : (
        children
      )}
    </Avatar.Group>
  );
};
