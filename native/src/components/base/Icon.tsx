import React, { ReactElement } from 'react'
import { StyleProp } from 'react-native'
import { SvgProps } from 'react-native-svg'

import { isRTL } from '../../constants/contentDirection'

type IconProps = {
  Icon: React.JSXElementConstructor<SvgProps>
  directionDependent?: boolean
  reverse?: boolean
  style?: StyleProp<SVGImageElement>
  width?: string | number
  height?: string | number
}

const Icon = ({
  Icon: IconProp,
  directionDependent = false,
  reverse = false,
  style,
  ...props
}: IconProps): ReactElement => (
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
    {...props}
  />
)

export default Icon
