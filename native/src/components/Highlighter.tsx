import React, { ReactElement } from 'react'
import { StyleProp, TextStyle } from 'react-native'
import { useTheme } from 'styled-components/native'

import { findAllMatches, findNormalizedMatches, normalizeString, FindChunks } from 'shared'

import Text from './base/Text'

type HighlighterProps = {
  search: string
  text: string
  style?: StyleProp<TextStyle>
  wordStartOnly?: boolean
}

const Highlighter = ({ search, text, style, wordStartOnly = false }: HighlighterProps): ReactElement => {
  const theme = useTheme()
  const chunks = findAllMatches({
    textToHighlight: text,
    searchWords: [search],
    sanitize: normalizeString,
    autoEscape: true,
    findChunks: (props: FindChunks) => findNormalizedMatches(props, { wordStartOnly }),
  })

  return (
    <Text style={style}>
      {chunks.map(chunk => {
        const matchedText = text.substring(chunk.start, chunk.end)
        return chunk.highlight === true ? (
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
