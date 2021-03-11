// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants'
import { Button } from 'react-native-elements'
import NothingFoundFeedbackBox from './NothingFoundFeedbackBox'
import type { TFunction } from 'react-i18next'

const FeedbackBox = styled.View`
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

type StateType = {|
  boxOpenedForQuery: ?string
|}

export class SearchFeedbackBox extends React.Component<PropsType, StateType> {
  state = { boxOpenedForQuery: null }

  openFeedbackBox = () => {
    this.props.sendFeedback('', this.props.query)
    this.setState({ boxOpenedForQuery: this.props.query })
  }

  render(): React.Node {
    const { resultsFound, query, t, theme, sendFeedback } = this.props
    if (!resultsFound || query === this.state.boxOpenedForQuery) {
      return (
        <FeedbackBox theme={theme}>
          <NothingFoundFeedbackBox query={query} t={t} theme={theme} sendFeedback={sendFeedback} />
        </FeedbackBox>
      )
    } else {
      return (
        <FeedbackBox theme={theme}>
          <Button
            titleStyle={{ color: theme.colors.textColor }}
            buttonStyle={{ backgroundColor: theme.colors.themeColor }}
            onPress={this.openFeedbackBox}
            title={t('feedback:informationNotFound')}
          />
        </FeedbackBox>
      )
    }
  }
}

export default SearchFeedbackBox
