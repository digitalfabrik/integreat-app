// @flow

import React from 'react'
import type {Node} from 'react'
import { Breadcrumb, OrderedList, Wrapper } from './Breadcrumbs.styles'
import type { UiDirection } from '../../../flowTypes'

type Props = {
  children: Array<Node>,
  direction: UiDirection
}

/**
 * Displays breadcrumbs (Links) for lower category levels
 */
class Breadcrumbs extends React.Component<Props> {
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
