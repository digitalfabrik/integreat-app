// @flow

import * as React from 'react'
import type { UiDirectionType } from '../../i18n/types/UiDirectionType'
import styled, { type StyledComponent } from 'styled-components'
import Breadcrumb from './Breadcrumb'
import BreadcrumbModel from '../BreadcrumbModel'
import BreadcrumbsJsonLd from '../../json-ld/components/BreadcrumbsJsonLd'
import type { ThemeType } from 'build-configs/ThemeType'

const opposite = (direction: UiDirectionType) => direction === 'ltr' ? 'rtl' : 'ltr'

const Wrapper: StyledComponent<{| direction: UiDirectionType |}, ThemeType, *> = styled.div`
  margin: 10px 0;
  text-align: end;
  white-space: nowrap;
  overflow-x: auto;
  direction: ${props => opposite(props.direction)};
`

const OrderedList: StyledComponent<{| direction: UiDirectionType |}, ThemeType, *> = styled.ol`
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

    // We are doing here funky stuff with directions. See here for more information about the idea:
    // https://css-tricks.com/position-vertical-scrollbars-on-opposite-side-with-css/
    // Basically we are inverting the direction on the wrapper and then making sure that the direction of the content
    // has the opposite direction of the wrapper.
    return <Wrapper direction={direction}>
      <BreadcrumbsJsonLd breadcrumbs={jsonLdBreadcrumbs} />
      <OrderedList direction={direction}>
        {ancestorBreadcrumbs.map((breadcrumb, key) => <Breadcrumb key={key}>{breadcrumb.node}</Breadcrumb>)}
      </OrderedList>
    </Wrapper>
  }
}

export default Breadcrumbs
