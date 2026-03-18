import { Box, Title, Text, Button, Center } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const ErrorPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Center h="100%">
      <Box ta="center">
        <Title order={1}>{t('page.error.title')}</Title>
        <Text mt="sm">{t('page.error.description')}</Text>
        <Button component={Link} to="/" mt="lg">
          {t('page.error.return')}
        </Button>
      </Box>
    </Center>
  );
};
