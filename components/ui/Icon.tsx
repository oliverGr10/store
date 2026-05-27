import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { Colors } from '@/constants/colors';

export type IconName = ComponentProps<typeof Ionicons>['name'];

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 20, color = Colors.text }: IconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}
