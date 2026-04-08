import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'display' | 'h1' | 'h2' | 'h3' | 'bodyLarge' | 'bodyMain' | 'caption' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'bodyMain',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        styles[type],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  display: {
    fontSize: Typography.display,
    lineHeight: Typography.lineHeight.display,
    fontFamily: 'RightGrotesk',
    fontWeight: '700',
  },
  h1: {
    fontSize: Typography.h1,
    lineHeight: Typography.lineHeight.h1,
    fontFamily: 'RightGrotesk',
    fontWeight: '700',
  },
  h2: {
    fontSize: Typography.h2,
    lineHeight: Typography.lineHeight.h2,
    fontFamily: 'RightGrotesk',
    fontWeight: '600',
  },
  h3: {
    fontSize: Typography.h3,
    lineHeight: Typography.lineHeight.h3,
    fontFamily: 'RightGrotesk',
    fontWeight: '600',
  },
  bodyLarge: {
    fontSize: Typography.bodyLarge,
    lineHeight: Typography.lineHeight.bodyLarge,
    fontFamily: 'RightGrotesk',
    fontWeight: '500',
  },
  bodyMain: {
    fontSize: Typography.bodyMain,
    lineHeight: Typography.lineHeight.bodyMain,
    fontFamily: 'RightGrotesk',
    fontWeight: '500',
  },
  caption: {
    fontSize: Typography.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: 'RightGrotesk',
    fontWeight: '500',
  },
  link: {
    fontSize: Typography.bodyMain,
    lineHeight: Typography.lineHeight.bodyMain,
    color: '#03B5AA',
    fontFamily: 'RightGrotesk',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
