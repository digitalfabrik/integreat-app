import React, { ReactElement } from 'react'
import SVG from 'react-inlinesvg'
import styled from 'styled-components'

const StyledIcon = styled(SVG)<{ $directionDependent: boolean; $reverse: boolean }>`
  transform: ${props =>
    (props.$reverse === true) !== (props.$directionDependent && props.theme.contentDirection === 'rtl')
      ? 'scaleX(-1)'
      : ''};
  color: ${props => props.theme.colors.textColor};
  width: 24px;
  height: 24px;
  --theme-color: ${props => props.theme.colors.themeColor};
`

type IconProps = {
  src: string
  directionDependent?: boolean
  reverse?: boolean
  className?: string
  title?: string
  id?: string
}

const Icon = ({ src, directionDependent = false, reverse = false, className, title, id }: IconProps): ReactElement => (
  <StyledIcon
    src={src}
    $directionDependent={directionDependent}
    $reverse={reverse}
    className={className}
    title={title}
    id={id}
  />
)

export default Icon
