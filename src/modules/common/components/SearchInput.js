import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import { translate } from 'react-i18next'
import styled from 'styled-components'

const searchLogoWidth = '25px'

const Spacer = styled.div`
  ${props => props.space && `margin: 50px 0;`}
`

const TextInput = styled.input.attrs({type: 'text'})`
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

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 10%;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const SearchIcon = styled(FontAwesome).attrs({name: 'search'})`
  width: 25px;
  font-size: 1.2em;
  text-align: center;
`

export class SearchInput extends React.Component {
  static propTypes = {
    filterText: PropTypes.string.isRequired,
    onFilterTextChange: PropTypes.func.isRequired,
    spaceSearch: PropTypes.bool,
    onClickInput: PropTypes.func,
    t: PropTypes.func.isRequired
  }

  onFilterTextChange = event => this.props.onFilterTextChange(event.target.value)

  render () {
    return (
      <Spacer space={this.props.spaceSearch}>
        <Wrapper>
          <SearchIcon />
          <TextInput placeholder={this.props.t('search')}
                     defaultValue={this.props.filterText}
                     onChange={this.onFilterTextChange}
                     onClick={this.props.onClickInput}
                     autoFocus />
        </Wrapper>
      </Spacer>
    )
  }
}

export default translate('common')(SearchInput)
