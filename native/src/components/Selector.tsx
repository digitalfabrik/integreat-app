import * as React from 'react'
import { ReactElement } from 'react'
import { css } from 'styled-components'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

import SelectorItemModel from '../models/SelectorItemModel'
import SelectorItem from './SelectorItem'

type WrapperPropsType = {
  vertical: boolean
  children: React.ReactNode
  theme: ThemeType
}
export const Wrapper = styled.View<WrapperPropsType>`
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  justify-content: center;
  color: ${props => props.theme.colors.textColor};
  text-align: center;

  ${props =>
    props.vertical
      ? css`
          flex-flow: column;
          align-items: center;
        `
      : ''}
`

type PropsType = {
  verticalLayout: boolean
  items: Array<SelectorItemModel>
  selectedItemCode: string | null
}

/**
 * Displays a Selector showing different items
 */
const Selector = ({ verticalLayout, items, selectedItemCode }: PropsType): ReactElement => (
  <Wrapper vertical={verticalLayout}>
    {items.map(item => (
      <SelectorItem key={item.code} model={item} selected={selectedItemCode === item.code} />
    ))}
  </Wrapper>
)

export default Selector
