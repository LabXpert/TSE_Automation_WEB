import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const SearchIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="21 21l-4.35-4.35"/>
  </svg>
);

export const FilterIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
  </svg>
);

export const FactoryIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M9 17h6l3 3v1H6v-1l3-3z"/>
    <path d="M9 17V8l-5 2v7"/>
    <path d="M15 17V8h5v9"/>
    <path d="M9 8V5a1 1 0 011-1h4a1 1 0 011 1v3"/>
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);

export const BuildingIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18H6z"/>
    <path d="M6 12h12"/>
    <path d="M6 8h12"/>
    <path d="M6 16h12"/>
  </svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

export const MailIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

export const ToolIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
  </svg>
);

export const CleanIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M3 6h18"/>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c0-1 1-2 2-2v2"/>
  </svg>
);

export const AlertIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M9 11l3 3L22 4"/>
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
    <path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
