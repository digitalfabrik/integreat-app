// @flow

import React, { useState } from 'react'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from 'build-configs/ThemeType'
import { Button } from 'react-native-elements'
import NothingFoundFeedbackBox from './NothingFoundFeedbackBox'
import type { TFunction } from 'react-i18next'

const FeedbackBox: StyledComponent<{||}, ThemeType, *> = styled.View`
  margin-top: 25px;
  padding: 15px 25px;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
`

type PropsType = {|
  query: string,
  resultsFound: boolean,
  theme: ThemeType,
  t: TFunction,
  sendFeedback: (comment: string, query: string) => Promise<void>
|}

const SearchFeedbackBox = ({ query, resultsFound, theme, t, sendFeedback }: PropsType) => {
  const [boxOpenedForQuery, setBoxOpenedForQuery] = useState<string | null>(null)

  const openFeedbackBox = () => {
    sendFeedback('', query)
    setBoxOpenedForQuery(query)
  }

  if (!resultsFound || query === boxOpenedForQuery) {
    return (
      <FeedbackBox>
        <NothingFoundFeedbackBox query={query} t={t} theme={theme} sendFeedback={sendFeedback} />
      </FeedbackBox>
    )
  } else {
    return (
      <FeedbackBox>
        <Button
          titleStyle={{ color: theme.colors.textColor }}
          buttonStyle={{ backgroundColor: theme.colors.themeColor }}
          onPress={openFeedbackBox}
          title={t('feedback:informationNotFound')}
        />
      </FeedbackBox>
    )
  }
}

export default SearchFeedbackBox
