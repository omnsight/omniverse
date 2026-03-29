import { Box, Title, Text, Center } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectPage: React.FC = () => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown === 0) {
      navigate('/');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <Center h="100%">
      <Box ta="center">
        <Title order={1}>{t('pages.RedirectPage.title')}</Title>
        <Text mt="sm">{t('pages.RedirectPage.description', { countdown })}</Text>
      </Box>
    </Center>
  );
};

export default RedirectPage;
