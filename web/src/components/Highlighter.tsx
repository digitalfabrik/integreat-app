import { useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import ReactHighlightWords from 'react-highlight-words'
import type { HighlighterProps as ReactHighlighterProps } from 'react-highlight-words'

import { findNormalizedMatches, normalizeString } from 'shared'
import { UiDirectionType } from 'translations'

// To fix CJS interop to not being recognized as a React component
const ReactHighlighter = ReactHighlightWords as unknown as React.ComponentClass<ReactHighlighterProps>

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
      highlightStyle={{
        backgroundColor: theme.palette.tertiary.light,
        fontWeight: 'bold',
        color: 'black',
      }}
      aria-label={text}
      autoEscape
      dir={dir}
    />
  )
}

export default Highlighter
