import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const getContainerStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: Colors.accent, borderWidth: 0 };
      case 'secondary':
        return { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border };
      case 'ghost':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.text.primary };
      case 'danger':
        return { backgroundColor: Colors.error, borderWidth: 0 };
    }
  };

  const getTextStyles = (): TextStyle => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return { color: '#FFFFFF' };
      case 'secondary':
      case 'ghost':
        return { color: Colors.text.primary };
    }
  };

  const getSpinnerColor = () => {
    return variant === 'primary' || variant === 'danger' ? '#FFFFFF' : Colors.text.primary;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        getContainerStyles(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getSpinnerColor()} />
      ) : (
        <Text style={[styles.text, getTextStyles(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'RightGrotesk',
    fontSize: 16,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.6,
  },
});
