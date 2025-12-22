import { Avatar, Tooltip } from '@mantine/core';
import { XMarkIcon } from '@heroicons/react/16/solid';
import { useTranslation } from 'react-i18next';

export const EmptyAvatar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Tooltip key="notfound" label={t('entity.common.EmptyAvatar.notFound')} withArrow>
      <Avatar size="md" radius="xl" color="gray" variant="light">
        <XMarkIcon />
      </Avatar>
    </Tooltip>
  );
};
