import styled, { css } from 'styled-components'

import { UiDirectionType } from 'translations/src'

export const DirectionIcon = styled.img<{ direction?: UiDirectionType }>`
  ${props =>
    props.direction === 'rtl' &&
    css`
      transform: scaleX(-1);
    `};
`
export default DirectionIcon
