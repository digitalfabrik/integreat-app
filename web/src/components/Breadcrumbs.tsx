import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { UiDirectionType } from 'translations'

import BreadcrumbModel from '../models/BreadcrumbModel'
import Breadcrumb from './Breadcrumb'
import JsonLdBreadcrumbs from './JsonLdBreadcrumbs'

const opposite = (direction: UiDirectionType) => (direction === 'ltr' ? 'rtl' : 'ltr')

const Wrapper = styled.nav<{ direction: UiDirectionType }>`
  margin: 10px 0;
  text-align: end;
  white-space: nowrap;
  overflow-x: auto;
  direction: ${props => opposite(props.direction)};
`

const OrderedList = styled.ol<{ direction: UiDirectionType }>`
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

type PropsType = {
  ancestorBreadcrumbs: Array<BreadcrumbModel>
  currentBreadcrumb: BreadcrumbModel
  direction: UiDirectionType
}

/**
 * Displays breadcrumbs (Links) for lower category levels and outputs a corresponding JSON-LD for rich search experience
 */
class Breadcrumbs extends React.PureComponent<PropsType> {
  static defaultProps = { direction: 'ltr' }

  render(): ReactNode {
    const { direction, ancestorBreadcrumbs, currentBreadcrumb } = this.props
    // The current page should not be listed in the UI, but should be within the JsonLd.
    const jsonLdBreadcrumbs = [...ancestorBreadcrumbs, currentBreadcrumb]

    // We are doing here funky stuff with directions. See here for more information about the idea:
    // https://css-tricks.com/position-vertical-scrollbars-on-opposite-side-with-css/
    // Basically we are inverting the direction on the wrapper and then making sure that the direction of the content
    // has the opposite direction of the wrapper.
    return (
      <Wrapper direction={direction}>
        <JsonLdBreadcrumbs breadcrumbs={jsonLdBreadcrumbs} />
        <OrderedList direction={direction}>
          {ancestorBreadcrumbs.map(breadcrumb => (
            <Breadcrumb key={breadcrumb.title}>{breadcrumb.node}</Breadcrumb>
          ))}
        </OrderedList>
      </Wrapper>
    )
  }
}

export default Breadcrumbs
