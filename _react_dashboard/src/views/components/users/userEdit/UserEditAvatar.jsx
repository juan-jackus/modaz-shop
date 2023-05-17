// ** Utils
import { onImageError } from '@utils';
// ** Custom Components
import Avatar from '@components/avatar';

const RenderUserAvatar = (avatar, name) => {
  const stateNum = Math.floor(Math.random() * 6),
    states = [
      'light-success',
      'light-danger',
      'light-warning',
      'light-info',
      'light-primary',
      'light-secondary',
    ],
    color = states[stateNum];
  if (avatar) {
    return (
      <img
        className='mr-2'
        src={avatar}
        width='150'
        height='150'
        style={{
          border: '3px solid #e9e9e9',
          borderRadius: '13px',
          objectFit: 'contain',
        }}
        onError={onImageError}
      />
    );
  } else {
    return (
      <Avatar
        initials
        color={color}
        className='rounded mr-2 my-25'
        content={name}
        contentStyles={{
          fontSize: '39px',
          width: '100%',
          height: '100%',
        }}
        style={{
          height: '150px',
          width: '150px',
        }}
      />
    );
  }
};

export default RenderUserAvatar;
