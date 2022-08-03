import Headroom from '@integreat-app/react-sticky-headroom'
import React, { ReactElement, ReactNode, useRef } from 'react'

import SearchInput from './SearchInput'

const SEARCH_BAR_HEIGHT = 45

type PropsType = {
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
}: PropsType): ReactElement => {
  const node = useRef<HTMLDivElement | null>(null)

  return (
    <div ref={node}>
      <Headroom
        pinStart={node.current?.offsetTop ?? 0}
        scrollHeight={SEARCH_BAR_HEIGHT}
        height={SEARCH_BAR_HEIGHT}
        onStickyTopChanged={onStickyTopChanged}>
        <SearchInput
          filterText={filterText}
          placeholderText={placeholderText}
          onFilterTextChange={onFilterTextChange}
          spaceSearch={spaceSearch}
        />
      </Headroom>
      {children}
    </div>
  )
}

export default ScrollingSearchBox
