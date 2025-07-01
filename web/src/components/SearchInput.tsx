import styled from '@emotion/styled'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import React, { ReactElement } from 'react'

import dimensions from '../constants/dimensions'
import { helpers } from '../constants/theme'
import Icon from './base/Icon'

const Spacer = styled.div<{ space: boolean }>`
  ${props => props.space && 'margin: 16px 0;'}
`

const TextInput = styled.input`
  height: 24px;
  box-sizing: border-box;
  color: ${props => props.theme.colors.textColor};
  background: transparent;
  border-width: 0 0 1px;
  border-color: ${props => props.theme.colors.textSecondaryColor};
  border-radius: 0;

  &:focus-visible {
    outline: none !important;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textColor};
  }
`

const Wrapper = styled.div`
  gap: 4px;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 10%;
  background-color: ${props => props.theme.colors.backgroundColor};
  display: flex;
  align-items: center;

  @media ${dimensions.smallViewport} {
    padding: 10px 5%;
    justify-content: center;
  }
`

const StyledIcon = styled(Icon)`
  align-self: flex-start;
  display: flex;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Description = styled.div`
  background-color: ${props => props.theme.colors.backgroundColor};
  margin-top: 8px;
  ${helpers.adaptiveFontSize};
`

type SearchInputProps = {
  placeholderText: string
  filterText: string
  onFilterTextChange: (filterText: string) => void
  spaceSearch?: boolean
  onClickInput?: () => void
  description?: string
  searchInputRef?: React.LegacyRef<HTMLDivElement>
}

const SearchInput = ({
  placeholderText,
  filterText,
  onClickInput,
  onFilterTextChange,
  spaceSearch = false,
  description,
  searchInputRef,
}: SearchInputProps): ReactElement => (
  <Spacer space={spaceSearch} ref={searchInputRef}>
    <Wrapper>
      <StyledIcon src={SearchOutlinedIcon} />
      <Column>
        {/* eslint-disable-next-line styled-components-a11y/no-autofocus -- in a dedicated search modal autofocus is fine */}
        <TextInput
          placeholder={placeholderText}
          aria-label={placeholderText}
          value={filterText}
          onChange={event => onFilterTextChange(event.target.value)}
          onClick={onClickInput}
          autoFocus
          type='text'
        />
        {!!description && <Description>{description}</Description>}
      </Column>
    </Wrapper>
  </Spacer>
)

export default SearchInput
