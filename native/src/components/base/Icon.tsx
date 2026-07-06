import React, { Children, cloneElement, isValidElement, ReactElement, ReactNode } from 'react'
import { ColorValue, View } from 'react-native'
import { Icon as PaperIcon } from 'react-native-paper'
import { SvgProps } from 'react-native-svg'
import { useTheme } from 'styled-components/native'

import { isRTL } from '../../constants/contentDirection'

const DEFAULT_ICON_SIZE = 24

const overrideSvgFillColor = (element: ReactNode, color: ColorValue): ReactNode => {
  if (!isValidElement<{ children?: ReactNode; fill?: string }>(element)) {
    return element
  }

  const { children, fill } = element.props

  return cloneElement(element, {
    ...(fill ? { fill: color as string } : {}),
    children: children != null ? Children.map(children, child => overrideSvgFillColor(child, color)) : children,
  })
}

type IconProps = {
  icon?: React.JSXElementConstructor<SvgProps>
  source?: string
  label?: string
  directionDependent?: boolean
  style?: { width?: number; height?: number; color?: ColorValue }
  color?: ColorValue
  overrideFillColors?: ColorValue
  size?: number
}

const Icon = ({
  icon,
  source,
  label,
  directionDependent = false,
  style,
  color,
  overrideFillColors,
  size,
}: IconProps): ReactElement | null => {
  const theme = useTheme()
  const defaultColor = theme.colors.onSurface

  if (source) {
    return (
      // The style here only for margin/padding that works with styled components
      <View
        style={[{ transform: [{ scaleX: directionDependent && isRTL() ? -1 : 1 }] }, style]}
        accessibilityLabel={label}>
        <PaperIcon source={source} size={size ?? DEFAULT_ICON_SIZE} color={(color ?? defaultColor) as string} />
      </View>
    )
  }

  const IconComponent = icon

  if (IconComponent) {
    const svgProps: SvgProps = {
      style: [{ transform: [{ scaleX: directionDependent && isRTL() ? -1 : 1 }] }, style],
      width: style?.width ?? DEFAULT_ICON_SIZE,
      height: style?.height ?? DEFAULT_ICON_SIZE,
      color: color ?? style?.color ?? defaultColor,
      accessibilityLabel: label,
    }

    // The svgr mock returns a string, not a function component, so guard against calling it directly.
    if (overrideFillColors !== undefined && typeof IconComponent === 'function') {
      return overrideSvgFillColor(
        (IconComponent as (props: SvgProps) => ReactNode)(svgProps),
        overrideFillColors,
      ) as ReactElement
    }

    return <IconComponent {...svgProps} />
  }
  return null
}

export default Icon
