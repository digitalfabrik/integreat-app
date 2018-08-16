// @flow

import React from 'react'

import LocationBig from '../assets/LocationBig.svg'
import { translate } from 'react-i18next'
import Caption from 'modules/common/components/Caption'
import type { TFunction } from 'react-i18next'
import styled from 'styled-components'

const Logo = styled.img`
  display: block;
  height: 70px;
  margin: 0 auto;
`

const StyledCaption = styled(Caption)`
  margin: 20px 0 30px;
`

type PropsType = {
  t: TFunction
}

class Heading extends React.Component<PropsType> {
  render () {
    const {t} = this.props
    return (
      <div>
        <Logo src={LocationBig} />
        <StyledCaption title={t('where')} />
      </div>
    )
  }
}

export default translate('landing')(Heading)
