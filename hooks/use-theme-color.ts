import { Colors } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors
) {
  return props.light ? props.light : (Colors as any)[colorName] || Colors.text.primary;
}
