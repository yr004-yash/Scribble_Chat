import React from 'react';
import gravatar from 'gravatar';

const Avatar = ({ email, size }) => {
  const avatarUrl = gravatar.url(email, { s: 40, d: 'monsterid' });

  return <img src={avatarUrl} alt="Avatar" width={size} height={size} style={{ objectFit: 'cover', objectPosition: '50% 50%',borderRadius:'50%',boxShadow:'0 0 20px rgba(0, 0, 255, 1.7)' }}/>;
};

export default Avatar;