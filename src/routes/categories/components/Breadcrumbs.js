// @flow

import React from 'react'

import { Link } from 'redux-little-router'
import { textSecondaryColor, textDecorationColor } from 'modules/common/constants/colors'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import LocationModel from 'modules/endpoint/models/LocationModel'
import styled from 'styled-components'
import { removeA } from '../../../modules/common/constants/helpers'

const Wrapper = styled.div`
  padding: 10px 0;
  white-space: nowrap;
  overflow-x: auto;

 /* avoid changing height when switching between pages (show line even if there are no breadcrumbs) */
  &:empty::after {
    padding-left: 1px;
    content: '';
  }
`

const Breadcrumb = styled(Link)`
  ${removeA}
`

const Separator = styled.span`
  &::after {
    color: ${textDecorationColor};
    font-size: 16px;
    content: ' > ';
  }
`

const Title = styled.span`
  color: ${textSecondaryColor};
  font-size: 15px;
`

type Props = {
  parents: Array<CategoryModel>,
  locations: Array<LocationModel>
}

/**
 * Displays breadcrumbs (Links) for lower category levels
 */
class Breadcrumbs extends React.Component<Props> {
  /**
   * Our root categories don't have the right title (location code instead of location title), so we have to compare the
   * title of the root category with the code of every location
   * @param {String} title The title of the category to search for
   * @return {String} The found name or the given title
   */
  getLocationName (title: string) {
    const location = this.props.locations.find(_location => title === _location.code)
    return location ? location.name : title
  }

  getBreadcrumbs () {
    return this.props.parents.map(parent => {
      const title = parent.id === 0 ? this.getLocationName(parent.title) : parent.title
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
