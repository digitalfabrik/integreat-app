// @flow

import * as React from 'react'
import type { UiDirectionType } from '../../i18n/types/UiDirectionType'
import styled from 'styled-components'
import Breadcrumb from './Breadcrumb'

const opposite = (direction: UiDirectionType) => direction === 'ltr' ? 'rtl' : 'ltr'

const Wrapper = styled.div`
  margin: 10px 0;
  text-align: end;
  white-space: nowrap;
  overflow-x: auto;
  direction: ${props => opposite(props.direction)};
`

const OrderedList = styled.ol`
  direction: ${props => props.direction};
  display: inline-block;
  list-style: none;
  margin: 0;
  padding: 0;

  /* avoid changing height when switching between pages (show one line even if there are no breadcrumbs) */
  &:empty::after {
    padding-left: 1px;
    content: '';
  }
`

type PropsType = {|
  children: Array<React.Node>,
  direction: UiDirectionType
|}

/**
 * Displays breadcrumbs (Links) for lower category levels
 */
class Breadcrumbs extends React.PureComponent<PropsType> {
  static defaultProps = { direction: 'ltr' }

  render () {
    const direction = this.props.direction
    return <Wrapper direction={direction}>
      <OrderedList direction={direction}>
        {this.props.children.map((child, key) => <Breadcrumb key={key}>{child}</Breadcrumb>)}
      </OrderedList>
    </Wrapper>
  }
}

export default Breadcrumbs
