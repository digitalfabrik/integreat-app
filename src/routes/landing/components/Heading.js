import React from 'react'

import LocationBig from '../assets/LocationBig.png'
import { translate } from 'react-i18next'
import Caption from 'modules/common/components/Caption'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'

const LocationImage = styled.Image`
  height: 70px;
  resize-mode: contain;
`

const Wrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`

class Heading extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired
  }

  render () {
    const {t} = this.props
    return (
      <Wrapper>
        <LocationImage source={LocationBig} />
        <Caption title={t('where')} />
      </Wrapper>
    )
  }
}

export default translate('landing')(Heading)
