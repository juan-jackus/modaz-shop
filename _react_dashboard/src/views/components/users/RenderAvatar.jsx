import React from 'react';
// ** Custom Components
import Avatar from '@components/avatar';

const RenderAvatar = ({ avatar, name, size = {} }) => {
  const { w = '33', h = '33' } = size;
  const randomIndex = Math.floor(Math.random() * 6);
  const avatarColors = [
    'light-success',
    'light-danger',
    'light-warning',
    'light-info',
    'light-primary',
    'light-secondary',
  ];
  const randomColor = avatarColors[randomIndex];

  if (avatar && avatar.length) {
    return <Avatar className='mr-1' img={avatar} imgWidth={w} imgHeight={h} />;
  } else {
    return (
      <Avatar
        color={randomColor || 'primary'}
        className='mr-1'
        content={name || '_'}
        initials
      />
    );
  }
};

export default RenderAvatar;
