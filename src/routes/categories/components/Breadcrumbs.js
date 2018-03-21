// @flow

import React from 'react'

import { Link } from 'redux-little-router'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin: 10px 0;
  white-space: nowrap;
  overflow-x: auto;

  /* avoid changing height when switching between pages (show line even if there are no breadcrumbs) */
  &:empty::after {
    padding-left: 1px;
    content: '';
  }
`

const Breadcrumb = styled(Link)`
  ${props => props.theme.helpers.removeA}
`

const Separator = styled.span`
  &::after {
    color: ${props => props.theme.colors.textDecorationColor};
    font-size: 16px;
    content: ' > ';
  }
`

const Title = styled.span`
  color: ${props => props.theme.colors.textSecondaryColor};
  font-size: 15px;
`

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
        <Breadcrumb key={parent.url} href={parent.url}>
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
