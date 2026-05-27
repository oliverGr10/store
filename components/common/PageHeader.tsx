import { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { Icon, IconName } from '@/components/ui/Icon';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: IconName;
  actionLabel?: string;
  actionIcon?: IconName;
  onActionPress?: () => void;
  rightSlot?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  icon,
  actionLabel,
  actionIcon,
  onActionPress,
  rightSlot,
}: PageHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.titleWrap}>
        {icon && (
          <View style={styles.iconBadge}>
            <Icon name={icon} size={20} color={Colors.primary} />
          </View>
        )}
        <View style={styles.textWrap}>
          <Text style={styles.title}>{title}</Text>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      {rightSlot ?? (
        actionLabel && onActionPress ? (
          <TouchableOpacity style={styles.actionButton} onPress={onActionPress}>
            {actionIcon && <Icon name={actionIcon} size={16} color={Colors.white} />}
            <Text style={styles.actionText}>{actionLabel}</Text>
          </TouchableOpacity>
        ) : null
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary100,
  },
  textWrap: {
    gap: 2,
    flexShrink: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
