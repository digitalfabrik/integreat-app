import React, { ReactElement } from 'react'
import SVG from 'react-inlinesvg'
import styled from 'styled-components'

const StyledIcon = styled(SVG)<{ $directionDependent: boolean; $reverse: boolean }>`
  transform: ${props =>
    (props.$reverse === true) !== (props.$directionDependent && props.theme.contentDirection === 'rtl')
      ? 'scaleX(-1)'
      : ''};
  color: ${props => props.theme.colors.textColor};
  inline-size: 24px;
  block-size: 24px;
`

type IconProps = {
  src: string
  directionDependent?: boolean
  reverse?: boolean
  className?: string
  title?: string
}

const Icon = ({ src, directionDependent = false, reverse = false, className, title }: IconProps): ReactElement => (
  <StyledIcon
    src={src}
    $directionDependent={directionDependent}
    $reverse={reverse}
    className={className}
    title={title}
  />
)

export default Icon
