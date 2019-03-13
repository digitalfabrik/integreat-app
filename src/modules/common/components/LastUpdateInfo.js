// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type Moment from 'moment'
import styled from 'styled-components'

const TimeStamp = styled.p`
  padding-top: 15px;
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.contentFontFamily};
  font-size: ${props => props.theme.fonts.contentFontSize};
`

type PropsType = {|
  lastUpdate: Moment,
  t: TFunction,
  language: string
|}

export class LastUpdateInfo extends React.PureComponent<PropsType> {
  render () {
    const {lastUpdate, t, language} = this.props
    lastUpdate.locale(language)

    // only show day, month and year
    const timestamp = lastUpdate.format('LL')

    return <TimeStamp>{t('lastUpdate')}{timestamp}</TimeStamp>
  }
}

export default withTranslation('common')(LastUpdateInfo)
