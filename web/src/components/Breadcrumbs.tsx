import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { UiDirectionType } from 'translations'

import iconHome from '../assets/IconHome.svg'
import BreadcrumbModel from '../models/BreadcrumbModel'
import Breadcrumb from './Breadcrumb'
import JsonLdBreadcrumbs from './JsonLdBreadcrumbs'

const opposite = (direction: UiDirectionType) => (direction === 'ltr' ? 'rtl' : 'ltr')

const Wrapper = styled.nav<{ direction: UiDirectionType }>`
  margin: 10px 0;
  text-align: start;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  direction: ${props => opposite(props.direction)};
`

const OrderedList = styled.ol<{ direction: UiDirectionType }>`
  direction: ${props => props.direction};
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  list-style: none;
  margin: 0;
  padding: 0;

  /* avoid changing height when switching between pages (show one line even if there are no breadcrumbs) */

  &:empty::after {
    padding-left: 1px;
    content: '';
  }
`

const HomeIcon = styled.img`
  width: 24px;
  height: 24px;
`

const StyledLink = styled(Link)`
  margin-right: 4px;
`

type BreadcrumbsProps = {
  ancestorBreadcrumbs: Array<BreadcrumbModel>
  currentBreadcrumb: BreadcrumbModel
  direction: UiDirectionType
}

const Breadcrumbs = ({ direction, ancestorBreadcrumbs, currentBreadcrumb }: BreadcrumbsProps): ReactElement => {
  // The current page should not be listed in the UI, but should be within the JsonLd.
  const jsonLdBreadcrumbs = [...ancestorBreadcrumbs, currentBreadcrumb]
  // Min text length after which the last breadcrumb item should shrink
  const MIN_SHRINK_CHARS = 20

  /* We are doing here funky stuff with directions. See here for more information about the idea:
   https://css-tricks.com/position-vertical-scrollbars-on-opposite-side-with-css/
   Basically we are inverting the direction on the wrapper and then making sure that the direction of the content
   has the opposite direction of the wrapper. */
  return (
    <Wrapper direction={direction}>
      <JsonLdBreadcrumbs breadcrumbs={jsonLdBreadcrumbs} />
      <OrderedList direction={direction}>
        {ancestorBreadcrumbs.map((breadcrumb, index) =>
          ancestorBreadcrumbs.length > 1 && index === 0 ? (
            <StyledLink to={breadcrumb.pathname} key={breadcrumb.pathname}>
              <HomeIcon src={iconHome} alt='' />
            </StyledLink>
          ) : (
            <Breadcrumb key={breadcrumb.title} shrink={breadcrumb.title.length >= MIN_SHRINK_CHARS}>
              {breadcrumb.node}
            </Breadcrumb>
          )
        )}
      </OrderedList>
    </Wrapper>
  )
}

export default Breadcrumbs
