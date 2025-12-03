import React, { ReactElement } from 'react'
import { StyleProp, Text, TextStyle } from 'react-native'
import styled from 'styled-components/native'

import { findAllMatches, findNormalizedMatches, normalizeString } from 'shared'

const StyledText = styled(Text)`
  color: ${props => props.theme.colors.onSurface};
`

const HighlightedText = styled(Text)`
  font-weight: bold;
  color: ${props => props.theme.legacy.isContrastTheme && props.theme.colors.secondary};
`

type HighlighterProps = {
  search: string
  text: string
  style?: StyleProp<TextStyle>
}

const Highlighter = ({ search, text, style }: HighlighterProps): ReactElement => {
  const chunks = findAllMatches({
    textToHighlight: text,
    searchWords: [search],
    sanitize: normalizeString,
    autoEscape: true,
    findChunks: findNormalizedMatches,
  })

  return (
    <StyledText style={style}>
      {chunks.map(chunk => {
        const matchedText = text.substring(chunk.start, chunk.end)
        return chunk.highlight ? <HighlightedText key={chunk.start}>{matchedText}</HighlightedText> : matchedText
      })}
    </StyledText>
  )
}

export default Highlighter
