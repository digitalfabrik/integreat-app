import styled from '@emotion/styled'
import React, { ReactElement } from 'react'
import { Link } from 'react-router'

import { UiDirectionType } from 'translations'

import { HouseIcon } from '../assets'
import BreadcrumbModel from '../models/BreadcrumbModel'
import Breadcrumb from './Breadcrumb'
import JsonLdBreadcrumbs from './JsonLdBreadcrumbs'
import Icon from './base/Icon'

const opposite = (direction: UiDirectionType) => (direction === 'ltr' ? 'rtl' : 'ltr')

const Wrapper = styled.nav`
  margin: 10px 0;
  text-align: start;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  direction: ${props => opposite(props.theme.contentDirection)};
`

const OrderedList = styled.ol`
  direction: ${props => props.theme.contentDirection};
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  list-style: none;
  margin: 0;
  padding: 0;

  /* avoid changing height when switching between pages (show one line even if there are no breadcrumbs) */

  &:empty::after {
    padding-inline-start: 1px;
    content: '';
  }
`

const StyledIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`

const StyledLink = styled(Link)`
  margin-inline-end: 4px;
`

type BreadcrumbsProps = {
  ancestorBreadcrumbs: BreadcrumbModel[]
  currentBreadcrumb: BreadcrumbModel
}

const Breadcrumbs = ({ ancestorBreadcrumbs, currentBreadcrumb }: BreadcrumbsProps): ReactElement => {
  // The current page should not be listed in the UI, but should be within the JsonLd.
  const jsonLdBreadcrumbs = [...ancestorBreadcrumbs, currentBreadcrumb]
  // Min text length after which the last breadcrumb item should shrink
  const MIN_SHRINK_CHARS = 20

  /* We do some funky stuff with directions here. See this link for more information about the idea:
   https://css-tricks.com/position-vertical-scrollbars-on-opposite-side-with-css/
   Basically, we are inverting the direction on the wrapper and then making sure that the direction of the content
   has the opposite direction of the wrapper. */
  return (
    <Wrapper>
      <JsonLdBreadcrumbs breadcrumbs={jsonLdBreadcrumbs} />
      <OrderedList>
        {ancestorBreadcrumbs.map((breadcrumb, index) =>
          ancestorBreadcrumbs.length > 1 && index === 0 ? (
            <li key={breadcrumb.pathname}>
              <StyledLink to={breadcrumb.pathname}>
                <StyledIcon src={HouseIcon} title={breadcrumb.title} />
              </StyledLink>
            </li>
          ) : (
            <Breadcrumb key={breadcrumb.title} shrink={breadcrumb.title.length >= MIN_SHRINK_CHARS}>
              {breadcrumb.node}
            </Breadcrumb>
          ),
        )}
      </OrderedList>
    </Wrapper>
  )
}

export default Breadcrumbs
