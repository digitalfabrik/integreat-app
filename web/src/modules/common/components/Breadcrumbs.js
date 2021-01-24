// @flow

import * as React from 'react'
import type { UiDirectionType } from '../../i18n/types/UiDirectionType'
import styled from 'styled-components'
import Breadcrumb from './Breadcrumb'
import BreadcrumbModel from '../BreadcrumbModel'
import BreadcrumbsJsonLd from '../../json-ld/components/BreadcrumbsJsonLd'

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
  ancestorBreadcrumbs: Array<BreadcrumbModel>,
  currentBreadcrumb: BreadcrumbModel,
  direction: UiDirectionType
|}

/**
 * Displays breadcrumbs (Links) for lower category levels and outputs a corresponding JSON-LD for rich search experience
 */
class Breadcrumbs extends React.PureComponent<PropsType> {
  static defaultProps = { direction: 'ltr' }

  render () {
    const { direction, ancestorBreadcrumbs, currentBreadcrumb } = this.props
    // The current page should not be listed in the UI, but should be within the JsonLd.
    const jsonLdBreadcrumbs = [...ancestorBreadcrumbs, currentBreadcrumb]

    return <Wrapper direction={direction}>
      <BreadcrumbsJsonLd breadcrumbs={jsonLdBreadcrumbs} />
      <OrderedList direction={direction}>
        {ancestorBreadcrumbs.map((breadcrumb, key) => <Breadcrumb key={key}>{breadcrumb.node}</Breadcrumb>)}
      </OrderedList>
    </Wrapper>
  }
}

export default Breadcrumbs
