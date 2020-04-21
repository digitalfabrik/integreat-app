// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type Moment from 'moment'
import styled from 'styled-components'

const TimeStamp = styled.p`
  padding: 0;
  margin: 0 !important;
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.contentFontFamily};
  font-size: ${props => props.theme.fonts.contentFontSize};
`

type PropsType = {|
  lastUpdate: Moment,
  t: TFunction,
  language: string,
  withText: string,
|}

export class LastUpdateInfo extends React.PureComponent<PropsType> {
  render () {
    const { lastUpdate, t, language, withText } = this.props
    lastUpdate.locale(language)

    // only show day, month and year
    const timestamp = lastUpdate.format('LL')

    return <TimeStamp>{withText && t('lastUpdate')}{timestamp}</TimeStamp>
  }
}

export default withTranslation('common')(LastUpdateInfo)
