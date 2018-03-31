// @flow

import React from 'react'
import CategoryModel from 'modules/endpoint/models/CategoryModel'
import { Breadcrumb, Separator, Title, Wrapper } from './Breadcrumbs.styles'

type Props = {
  parents: Array<CategoryModel>,
  locationName: string
}

/**
 * Displays breadcrumbs (Links) for lower category levels
 */
class Breadcrumbs extends React.Component<Props> {
  getBreadcrumbs () {
    return this.props.parents.map(parent => {
      const title = parent.id === 0 ? this.props.locationName : parent.title
      return (
        <Breadcrumb key={parent.url} to={parent.url}>
          <Separator />
          <Title>{title}</Title>
        </Breadcrumb>
      )
    })
  }

  render () {
    return <Wrapper>
      {this.getBreadcrumbs()}
    </Wrapper>
  }
}

export default Breadcrumbs
