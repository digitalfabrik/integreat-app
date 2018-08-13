// @flow

import styled from 'styled-components'
import FontAwesome from 'react-fontawesome'

const searchLogoWidth = '25px'

export const Spacer = styled.div`
  ${props => props.space && `margin: 50px 0;`}
`

export const TextInput = styled.input.attrs({type: 'text'})`
  width: calc(100% - ${searchLogoWidth} - 5px);
  height: 25px;
  box-sizing: border-box;
  margin-left: 5px;
  color: ${props => props.theme.colors.textColor};
  background: transparent;
  border-width: 0 0 1px;
  border-color: ${props => props.theme.colors.textSecondaryColor};
  outline: none;
  border-radius: 0;

  &::placeholder {
    color: ${props => props.theme.colors.textColor}
  }
`

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 10%;
  background-color: ${props => props.theme.colors.backgroundColor};
`

export const SearchIcon = styled(FontAwesome).attrs({name: 'search'})`
  width: 25px;
  font-size: 1.2em;
  text-align: center;
`
