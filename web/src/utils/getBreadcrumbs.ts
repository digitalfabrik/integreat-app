import React from 'react'

import BreadcrumbModel from '../models/BreadcrumbModel'

const getBreadcrumbs = (
  ancestorBreadcrumbs: BreadcrumbModel[],
  currentBreadcrumb: BreadcrumbModel,
  returnAllBreadcrumbs: boolean,
  StyledEllipsis: React.ElementType,
): BreadcrumbModel[] => {
  const allBreadcrumbs = [...ancestorBreadcrumbs, currentBreadcrumb]
  const breadCrumbsLimit = 3 // with home included
  const lastTwoCrumbs = -2

  if (ancestorBreadcrumbs.length === 0) {
    return []
  }

  if (allBreadcrumbs.length <= breadCrumbsLimit) {
    return allBreadcrumbs
  }

  const home = allBreadcrumbs[0] as BreadcrumbModel
  const rest = allBreadcrumbs.slice(1)
  const ellipsisPathname = returnAllBreadcrumbs ? '' : (rest[0]?.pathname ?? '/')

  const ellipsis = new BreadcrumbModel({
    title: '...',
    pathname: ellipsisPathname,
    node: React.createElement(StyledEllipsis, null, '...'),
  })

  if (returnAllBreadcrumbs) {
    return [home, ...rest]
  }

  return [home, ellipsis, ...rest.slice(lastTwoCrumbs)]
}

export default getBreadcrumbs
