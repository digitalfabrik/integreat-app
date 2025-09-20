import Headroom from '@integreat-app/react-sticky-headroom'
import React, { ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useWindowDimensions from '../hooks/useWindowDimensions'
import SearchInput from './SearchInput'

type ScrollingSearchBoxProps = {
  filterText: string
  onFilterTextChange: (filterText: string) => void
  spaceSearch?: boolean
  children: ReactNode
  placeholderText: string
  onStickyTopChanged: (stickyTop: number) => void
}

const ScrollingSearchBox = ({
  filterText,
  children,
  onFilterTextChange,
  onStickyTopChanged,
  placeholderText,
  spaceSearch = false,
}: ScrollingSearchBoxProps): ReactElement => {
  const [searchBarHeight, setSearchBarHeight] = useState(0)
  const node = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLDivElement | null>(null)
  const { t } = useTranslation('landing')
  const { window } = useWindowDimensions()

  useEffect(() => {
    if (searchInputRef.current) {
      setSearchBarHeight(searchInputRef.current.clientHeight)
    }
  }, [window.width])

  return (
    <div ref={node}>
      <Headroom
        pinStart={node.current?.offsetTop ?? 0}
        scrollHeight={searchBarHeight}
        height={searchBarHeight}
        onStickyTopChanged={onStickyTopChanged}
        zIndex={2}>
        <SearchInput
          filterText={filterText}
          placeholderText={placeholderText}
          onFilterTextChange={onFilterTextChange}
          spaceSearch={spaceSearch}
          description={t('searchCityDescription')}
          searchInputRef={searchInputRef}
        />
      </Headroom>
      {children}
    </div>
  )
}

export default ScrollingSearchBox
