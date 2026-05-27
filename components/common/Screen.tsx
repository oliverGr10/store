import { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View, ViewStyle, ScrollViewProps } from 'react-native';
import { Colors } from '@/constants/colors';

interface ScreenProps extends Pick<ScrollViewProps, 'refreshControl'> {
  children: ReactNode;
  scrollable?: boolean;
  contentStyle?: ViewStyle;
  innerStyle?: ViewStyle;
}

export function Screen({ children, scrollable = false, contentStyle, innerStyle, refreshControl }: ScreenProps) {
  const content = (
    <View style={[styles.inner, innerStyle]}>
      {children}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, contentStyle]}
        refreshControl={refreshControl}
      >
        {content}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, styles.staticContent, contentStyle]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  staticContent: {
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 32 : 60,
    paddingBottom: 24,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: 1120,
    gap: 16,
  },
});
