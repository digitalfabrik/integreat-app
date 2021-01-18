// @flow

import * as React from 'react'
import styled from 'styled-components'
import Breadcrumb from './Breadcrumb'
import BreadcrumbModel from '../BreadcrumbModel'
import BreadcrumbsJsonLd from '../../json-ld/components/BreadcrumbsJsonLd'

const Wrapper = styled.div`
  margin: 10px 0;
  white-space: nowrap;
  overflow-x: auto;
`

const OrderedList = styled.ol`
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
  ancestorBreadcrumbs: Array<BreadcrumbModel>,
  currentBreadcrumb: BreadcrumbModel
|}

/**
 * Displays breadcrumbs (Links) for lower category levels and outputs a corresponding JSON-LD for rich search experience
 */
class Breadcrumbs extends React.PureComponent<PropsType> {
  render () {
    const { ancestorBreadcrumbs, currentBreadcrumb } = this.props
    // The current page should not be listed in the UI, but should be within the JsonLd.
    const jsonLdBreadcrumbs = [...ancestorBreadcrumbs, currentBreadcrumb]

    return <Wrapper>
      <BreadcrumbsJsonLd breadcrumbs={jsonLdBreadcrumbs} />
      <OrderedList>
        {ancestorBreadcrumbs.map((breadcrumb, key) => <Breadcrumb key={key}>{breadcrumb.node}</Breadcrumb>)}
      </OrderedList>
    </Wrapper>
  }
}

export default Breadcrumbs
