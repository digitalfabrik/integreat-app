// @flow

import type { TFunction } from 'react-i18next'

import React from 'react'
import styled from 'styled-components'
import { translate } from 'react-i18next'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Text } from 'react-native'

const ViewContainer = styled.View`
flex: 1;
align-items: center;
margin-top: 10%;
`

type PropsType = {|
  error: Error,
  t: TFunction
|}

export class Failure extends React.Component<PropsType> {
  render () {
    const {t} = this.props
    return <ViewContainer>
      <Icon name='frown-o' size={50} />
      <Text>
        {t('loadingFailed')}
      </Text>
    </ViewContainer>
  }
}

export default translate('error')(Failure)
