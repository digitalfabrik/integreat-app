import React, { ReactElement } from 'react'
import { ColorValue } from 'react-native'
import { SvgProps } from 'react-native-svg'
import { useTheme } from 'styled-components/native'

import { isRTL } from '../../constants/contentDirection'

const DEFAULT_ICON_SIZE = 24

type IconProps = {
  Icon: React.JSXElementConstructor<SvgProps>
  directionDependent?: boolean
  reverse?: boolean
  style?: Record<string, number>[]
}

const Icon = ({ Icon: IconProp, directionDependent = false, reverse = false, style }: IconProps): ReactElement => {
  const theme = useTheme()

  return (
    <IconProp
      style={[
        {
          transform: [
            {
              scaleX: reverse !== (directionDependent && isRTL()) ? -1 : 1,
            },
          ],
        },
        style,
      ]}
      width={style?.[0]?.width ?? DEFAULT_ICON_SIZE}
      height={style?.[0]?.height ?? DEFAULT_ICON_SIZE}
      color={(style?.[0]?.color as ColorValue | undefined) ?? theme.colors.textColor}
    />
  )
}

export default Icon
