// @flow

import React from 'react'

import LocationBig from '../assets/LocationBig.svg'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import Caption from '../../../modules/common/components/Caption'
import styled from 'styled-components'

const Logo = styled.img`
  display: block;
  height: 70px;
  margin: 0 auto;
`

type PropsType = {|
  t: TFunction
|}

class Heading extends React.PureComponent<PropsType> {
  render () {
    const {t} = this.props
    return (
      <div>
        <Logo src={LocationBig} />
        <Caption title={t('where')} />
      </div>
    )
  }
}

export default withTranslation('landing')(Heading)
