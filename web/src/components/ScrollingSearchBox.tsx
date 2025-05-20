import Headroom from '@integreat-app/react-sticky-headroom'
import React, { ReactElement, ReactNode, useRef } from 'react'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import { helpers } from '../constants/theme'
import useWindowDimensions from '../hooks/useWindowDimensions'
import SearchInput from './SearchInput'

const SEARCH_BAR_HEIGHT = 60
const SEARCH_BAR_HEIGHT_SMALL_DEVICES = 80
const SEARCH_BAR_ORIGINAL_HEIGHT = 45

const StyledHelperText = styled.div`
  width: fit-content;
  padding: 0 14%;
  background-color: ${props => props.theme.colors.backgroundColor};

  @media ${dimensions.smallViewport} {
    padding: 0 16%;
  }
  ${helpers.adaptiveFontSize};
`

type ScrollingSearchBoxProps = {
  filterText: string
  onFilterTextChange: (filterText: string) => void
  spaceSearch?: boolean
  children: ReactNode
  placeholderText: string
  onStickyTopChanged: (stickyTop: number) => void
  helperText?: string
}

const ScrollingSearchBox = ({
  filterText,
  children,
  onFilterTextChange,
  onStickyTopChanged,
  placeholderText,
  spaceSearch = false,
  helperText,
}: ScrollingSearchBoxProps): ReactElement => {
  const node = useRef<HTMLDivElement | null>(null)
  const { viewportSmall } = useWindowDimensions()
  const searchBarHeight = viewportSmall ? SEARCH_BAR_HEIGHT_SMALL_DEVICES : SEARCH_BAR_HEIGHT

  return (
    <div ref={node}>
      <Headroom
        pinStart={node.current?.offsetTop ?? 0}
        scrollHeight={helperText ? searchBarHeight : SEARCH_BAR_ORIGINAL_HEIGHT}
        height={helperText ? searchBarHeight : SEARCH_BAR_ORIGINAL_HEIGHT}
        onStickyTopChanged={onStickyTopChanged}>
        <SearchInput
          filterText={filterText}
          placeholderText={placeholderText}
          onFilterTextChange={onFilterTextChange}
          spaceSearch={spaceSearch}
        />
        {!!helperText && <StyledHelperText>{helperText}</StyledHelperText>}
      </Headroom>
      {children}
    </div>
  )
}

export default ScrollingSearchBox
