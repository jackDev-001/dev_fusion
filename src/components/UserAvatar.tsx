import React from 'react';

interface UserAvatarProps {
  name: string;
  className?: string;
  textClassName?: string;
}

const BG_GRADIENTS = [
  'bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white',
  'bg-gradient-to-tr from-purple-600 to-pink-600 text-white',
  'bg-gradient-to-tr from-emerald-600 to-teal-700 text-white',
  'bg-gradient-to-tr from-amber-500 to-orange-600 text-white',
  'bg-gradient-to-tr from-blue-600 to-cyan-600 text-white',
];

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  className = 'w-8 h-8 text-xs font-black',
  textClassName = ''
}) => {
  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';
  
  // Pick deterministic color based on sum of char codes
  const charCodeSum = name ? name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) : 0;
  const bgClass = BG_GRADIENTS[charCodeSum % BG_GRADIENTS.length];

  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 select-none shadow-2xs ${bgClass} ${className}`}
      title={name}
    >
      <span className={`leading-none uppercase tracking-widest ${textClassName}`}>{initial}</span>
    </div>
  );
};
