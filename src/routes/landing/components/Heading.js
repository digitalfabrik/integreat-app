// @flow

import React from 'react'

import LocationBig from '../assets/LocationBig.png'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import Caption from '../../../modules/common/components/Caption'
import styled from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants/theme'

const LocationImage = styled.Image`
  height: 70px;
  resize-mode: contain;
`

const Wrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`

type PropsType = {|
  t: TFunction,
  theme: ThemeType
|}

class Heading extends React.Component<PropsType> {
  render () {
    const {t, theme} = this.props
    return (
      <Wrapper>
        <LocationImage source={LocationBig} />
        <Caption title={t('where')} theme={theme} />
      </Wrapper>
    )
  }
}

export default translate('landing')(Heading)
