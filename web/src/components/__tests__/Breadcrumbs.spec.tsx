import React from 'react'

import BreadcrumbModel from '../../models/BreadcrumbModel'
import { renderWithRouterAndTheme } from '../../testing/render'
import Breadcrumbs from '../Breadcrumbs'

const breadcrumb0: BreadcrumbModel = {
  title: 'Landkreis München',
  _title: 'Landkreis München',
  pathname: '/lkmuenchen/de',
  _pathname: '/lkmuenchen/de',
  node: <a href='/lkmuenchen/de'>Landkreis München</a>,
  _node: <a href='/lkmuenchen/de'>Landkreis München</a>,
}

const breadcrumb1: BreadcrumbModel = {
  title: 'Ankommen und Leben in Deutschland',
  _title: 'Ankommen und Leben in Deutschland',
  pathname: '/lkmuenchen/de/ankommen-und-leben-in-deutschland',
  _pathname: '/lkmuenchen/de/ankommen-und-leben-in-deutschland',
  node: <a href='/lkmuenchen/de/ankommen-und-leben-in-deutschland'>Ankommen und Leben in Deutschland</a>,
  _node: <a href='/lkmuenchen/de/ankommen-und-leben-in-deutschland'>Ankommen und Leben in Deutschland</a>,
}

const breadcrumb2: BreadcrumbModel = {
  title: 'Mobilität',
  _title: 'Mobilität',
  pathname: '/lkmuenchen/de/ankommen-und-leben-in-deutschland/mobilitaet',
  _pathname: '/lkmuenchen/de/ankommen-und-leben-in-deutschland/mobilitaet',
  node: <a href='/lkmuenchen/de/ankommen-und-leben-in-deutschland/mobilitaet'>Mobilität</a>,
  _node: <a href='/lkmuenchen/de/ankommen-und-leben-in-deutschland/mobilitaet'>Mobilität</a>,
}

const render = (ancestors: BreadcrumbModel[], current: BreadcrumbModel) =>
  renderWithRouterAndTheme(<Breadcrumbs ancestorBreadcrumbs={ancestors} currentBreadcrumb={current} direction='ltr' />)

describe('Breadcrumbs', () => {
  it('should display correctly on the first level', () => {
    const ancestors = [breadcrumb0]
    const { getByText, queryByText } = render(ancestors, breadcrumb0)

    expect(getByText(breadcrumb0.title).getAttribute('href')).toBe(breadcrumb0.pathname)
    expect(queryByText(breadcrumb1.title)).toBeFalsy()
  })

  it('should display correctly on a lower level', () => {
    const ancestors = [breadcrumb0, breadcrumb1]
    const { getAllByRole, getByText, queryByText } = render(ancestors, breadcrumb2)

    expect(getAllByRole('link')[0]?.getAttribute('href')).toBe(breadcrumb0.pathname)
    expect(getByText(breadcrumb1.title).getAttribute('href')).toBe(breadcrumb1.pathname)
    expect(queryByText(breadcrumb2.title)).toBeFalsy()
  })
})
