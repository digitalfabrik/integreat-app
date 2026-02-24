import React, { ReactElement } from 'react'
import { StyleProp, TextStyle } from 'react-native'
import { useTheme } from 'styled-components/native'

import { findAllMatches, findNormalizedMatches, normalizeString } from 'shared'

import Text from './base/Text'

type HighlighterProps = {
  search: string
  text: string
  style?: StyleProp<TextStyle>
}

const Highlighter = ({ search, text, style }: HighlighterProps): ReactElement => {
  const theme = useTheme()
  const chunks = findAllMatches({
    textToHighlight: text,
    searchWords: [search],
    sanitize: normalizeString,
    autoEscape: true,
    findChunks: findNormalizedMatches,
  })

  return (
    <Text style={style}>
      {chunks.map(chunk => {
        const matchedText = text.substring(chunk.start, chunk.end)
        return chunk.highlight ? (
          <Text
            key={chunk.start}
            style={{
              color: theme.colors.onBackground,
              backgroundColor: theme.colors.surfaceVariant,
              fontWeight: 'bold',
            }}>
            {matchedText}
          </Text>
        ) : (
          matchedText
        )
      })}
    </Text>
  )
}

export default Highlighter
