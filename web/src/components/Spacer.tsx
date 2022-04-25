import styled from 'styled-components'

const Spacer = styled.hr<{ borderColor: string }>`
  margin: 12px 0;
  border: 1px solid ${props => props.borderColor};
`
export default Spacer
