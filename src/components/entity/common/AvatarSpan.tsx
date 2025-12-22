import React from 'react';
import { Avatar } from '@mantine/core';
import { EmptyAvatar } from './EmptyAvatar';

interface Props {
  children: React.ReactNode[];
}

export const AvatarSpan: React.FC<Props> = ({ children }) => {
  return <Avatar.Group>{children.length === 0 ? <EmptyAvatar /> : children}</Avatar.Group>;
};
