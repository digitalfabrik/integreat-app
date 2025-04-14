import React, { ReactElement } from 'react'
import ReactHighlighter from 'react-highlight-words'
import { useTheme } from 'styled-components'

import { findNormalizedMatches, normalizeString } from 'shared'
import { UiDirectionType } from 'translations'

import { useContrastTheme } from '../hooks/useContrastTheme'

type HighlighterProps = {
  search: string
  text: string
  className?: string
  dir?: UiDirectionType | 'auto'
}

const Highlighter = ({ search, text, className, dir }: HighlighterProps): ReactElement => {
  const theme = useTheme()
  const { isContrastTheme } = useContrastTheme()
  return (
    <ReactHighlighter
      className={className}
      textToHighlight={text}
      searchWords={[search]}
      sanitize={normalizeString}
      findChunks={findNormalizedMatches}
      highlightStyle={{
        backgroundColor: theme.colors.backgroundColor,
        fontWeight: 'bold',
        color: isContrastTheme ? theme.colors.themeColor : theme.colors.backgroundColor,
      }}
      aria-label={text}
      autoEscape
      dir={dir}
    />
  )
}

export default Highlighter
