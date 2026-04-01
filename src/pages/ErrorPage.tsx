import { Box, Title, Text, Button, Center } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const ErrorPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const { errorName, redirect_timeout } = location.state || {
    errorName: 'error',
    redirect_timeout: 5,
  };

  const [countdown, setCountdown] = useState(redirect_timeout);

  useEffect(() => {
    if (redirect_timeout <= 0) {
      return;
    }

    if (countdown === 0) {
      navigate('/', { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate, redirect_timeout]);

  return (
    <Center h="100%">
      <Box ta="center">
        <Title order={1}>{t(`pages.ErrorPage.title.${errorName}`)}</Title>
        <Text mt="sm">{t(`pages.ErrorPage.description.${errorName}`)}</Text>
        {redirect_timeout > 0 ? (
          <Text mt="sm">{t('pages.ErrorPage.redirect', { countdown })}</Text>
        ) : (
          <Button component={Link} to="/" mt="lg">
            {t('pages.ErrorPage.return')}
          </Button>
        )}
      </Box>
    </Center>
  );
};
