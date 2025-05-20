import styled from '@emotion/styled'

const Spacer = styled.hr<{ $borderColor: string }>`
  margin: 12px 0;
  border: 1px solid ${props => props.$borderColor};
`
export default Spacer
