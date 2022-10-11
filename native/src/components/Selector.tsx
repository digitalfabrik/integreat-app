import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import SelectorItemModel from '../models/SelectorItemModel'
import SelectorItem from './SelectorItem'

export const Wrapper = styled.View`
  display: flex;
  width: 100%;
  flex-flow: column;
  justify-content: center;
  color: ${props => props.theme.colors.textColor};
  text-align: center;
  align-items: center;
`

type SelectorPropsType = {
  items: Array<SelectorItemModel>
  selectedItemCode: string | null
}

const Selector = ({ items, selectedItemCode }: SelectorPropsType): ReactElement => (
  <Wrapper>
    {items.map(item => (
      <SelectorItem key={item.code} model={item} selected={selectedItemCode === item.code} />
    ))}
  </Wrapper>
)

export default Selector
