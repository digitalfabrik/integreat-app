// @flow

import * as React from 'react'
import { Breadcrumb, OrderedList, Wrapper } from './Breadcrumbs.styles'
import type { UiDirectionType } from '../../../flowTypes'

type PropsType = {
  children: Array<React.Node>,
  direction: UiDirectionType
}

/**
 * Displays breadcrumbs (Links) for lower category levels
 */
class Breadcrumbs extends React.Component<PropsType> {
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
