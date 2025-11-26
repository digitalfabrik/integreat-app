import React, { ReactElement } from 'react'
import { ColorValue, View } from 'react-native'
import { Icon as PaperIcon } from 'react-native-paper'
import { SvgProps } from 'react-native-svg'
import { useTheme } from 'styled-components/native'

import { isRTL } from '../../constants/contentDirection'

const DEFAULT_ICON_SIZE = 24

type IconProps = {
  Icon?: React.JSXElementConstructor<SvgProps>
  source?: string
  label?: string
  directionDependent?: boolean
  reverse?: boolean
  style?: { width?: number; height?: number; color?: ColorValue }
  color?: ColorValue
  size?: number
}

const getTransformStyle = (reverse: boolean, directionDependent: boolean) => ({
  transform: [
    {
      scaleX: reverse !== (directionDependent && isRTL()) ? -1 : 1,
    },
  ],
})

const Icon = ({
  Icon: IconProp,
  source,
  label,
  directionDependent = false,
  reverse = false,
  style,
  color,
  size,
}: IconProps): ReactElement | null => {
  const theme = useTheme()
  const defaultColor = theme.legacy.colors.textColor

  if (source) {
    return (
      // The style here only for margin/padding or inverting the icon
      <View style={[getTransformStyle(reverse, directionDependent), style]} accessibilityLabel={label}>
        <PaperIcon source={source} size={size ?? DEFAULT_ICON_SIZE} color={(color ?? defaultColor) as string} />
      </View>
    )
  }

  if (IconProp) {
    return (
      <IconProp
        style={[getTransformStyle(reverse, directionDependent), style]}
        width={style?.width ?? DEFAULT_ICON_SIZE}
        height={style?.height ?? DEFAULT_ICON_SIZE}
        color={color ?? style?.color ?? defaultColor}
        accessibilityLabel={label}
      />
    )
  }
  return null
}

export default Icon
