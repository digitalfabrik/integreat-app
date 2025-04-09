import React, { ReactElement } from 'react'
import ReactHighlighter from 'react-highlight-words'
import { useTheme } from 'styled-components'

import { findNormalizedMatches, normalizeString } from 'shared'
import { UiDirectionType } from 'translations'

type HighlighterProps = {
  search: string
  text: string
  className?: string
  dir?: UiDirectionType | 'auto'
}

const Highlighter = ({ search, text, className, dir }: HighlighterProps): ReactElement => {
  const theme = useTheme()
  return (
    <ReactHighlighter
      className={className}
      textToHighlight={text}
      searchWords={[search]}
      sanitize={normalizeString}
      findChunks={findNormalizedMatches}
      highlightStyle={{ backgroundColor: theme.colors.backgroundColor, fontWeight: 'bold' }}
      aria-label={text}
      autoEscape
      dir={dir}
    />
  )
}

export default Highlighter
