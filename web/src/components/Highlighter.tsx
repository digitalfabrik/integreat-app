import { useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import ReactHighlighter from 'react-highlight-words'

import { findNormalizedMatches, normalizeString, FindChunks } from 'shared'
import { UiDirectionType } from 'translations'

type HighlighterProps = {
  search: string
  text: string
  className?: string
  dir?: UiDirectionType | 'auto'
  wordStartOnly?: boolean
}

const Highlighter = ({ search, text, className, dir, wordStartOnly = false }: HighlighterProps): ReactElement => {
  const theme = useTheme()
  return (
    <ReactHighlighter
      className={className}
      textToHighlight={text}
      searchWords={[search]}
      sanitize={normalizeString}
      findChunks={(props: FindChunks) => findNormalizedMatches(props, { wordStartOnly })}
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
