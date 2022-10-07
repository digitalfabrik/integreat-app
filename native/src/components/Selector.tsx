import { useNetInfo } from '@react-native-community/netinfo'
import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import WarningIcon from '../assets/warning.svg'
import SelectorItemModel from '../models/SelectorItemModel'
import SelectorItem from './SelectorItem'
import Text from './base/Text'

export const Wrapper = styled.View`
  display: flex;
  width: 100%;
  flex-flow: column;
  justify-content: center;
  color: ${props => props.theme.colors.textColor};
  text-align: center;
  align-items: center;
`

const OfflineWarning = styled.View`
  disaply: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.colors.themeColor};
  padding: 20px;
  margin: 20px;
`

const IconContainer = styled.Image`
  height: 30px;
  width: 30px;
  resizemode: contain;
`

type PropsType = {
  items: Array<SelectorItemModel>
  selectedItemCode: string | null
}

const Selector = ({ items, selectedItemCode }: PropsType): ReactElement => {
  const netInfo = useNetInfo()
  return (
    <>
      {!netInfo.isConnected && (
        <OfflineWarning>
          <IconContainer source={WarningIcon} />
          <Text>You are currently offline. Some languages are not available.</Text>
        </OfflineWarning>
      )}
      <Wrapper>
        {items.map(item => (
          <SelectorItem
            key={item.code}
            model={item}
            selected={selectedItemCode === item.code}
            isOnline={netInfo.isConnected}
          />
        ))}
      </Wrapper>
    </>
  )
}

export default Selector
