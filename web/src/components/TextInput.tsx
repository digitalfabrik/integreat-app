import styled from 'styled-components'

const TextInput = styled.input`
  border-radius: 0.25rem;
  background-clip: padding-box;
  border: 1px solid ${props => props.theme.colors.textDisabledColor};
  padding: 0.5rem 0.75rem;
  resize: none;
`

export default TextInput
