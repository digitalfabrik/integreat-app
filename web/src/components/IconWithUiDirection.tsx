import styled from 'styled-components'

import { UiDirectionType } from 'translations'

const IconWithUiDirection = styled.img<{ direction?: UiDirectionType }>`
  transform: ${props => (props.direction === 'rtl' ? 'scaleX(-1)' : '')};
`
export default IconWithUiDirection
