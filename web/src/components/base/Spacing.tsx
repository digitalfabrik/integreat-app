import styled from '@emotion/styled'

const Spacing = styled.div<{ scalingFactor?: number }>`
  width: ${props => props.theme.spacing(props.scalingFactor ?? 1)};
  height: ${props => props.theme.spacing(props.scalingFactor ?? 1)};
`

export default Spacing
