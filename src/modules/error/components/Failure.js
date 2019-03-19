// @flow

import type { TFunction } from 'react-i18next'

import React from 'react'
import styled from 'styled-components/native'
import { translate } from 'react-i18next'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { Text } from 'react-native'

const ViewContainer = styled.View`
flex: 1;
align-items: center;
margin-top: 15%;
`

const IconContainer = styled(MaterialIcon)`
margin-bottom: 10px;
`

type PropsType = {|
  error: Error,
  t: TFunction
|}

export class Failure extends React.Component<PropsType> {
  render () {
    const { t } = this.props

    return <ViewContainer>
      <IconContainer name='sentiment-dissatisfied' size={55} color={'black'} />
      <Text>
        {t('loadingFailed')}
      </Text>
    </ViewContainer>
  }
}

export default translate('error')(Failure)
