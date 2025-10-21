import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import { BreadcrumbProps } from '../Breadcrumb'
import Breadcrumbs from '../Breadcrumbs'

jest.mock('react-i18next')

const homeBreadcrumb: BreadcrumbProps = {
  title: 'Home',
  to: '/',
}

const breadcrumb0: BreadcrumbProps = {
  title: 'Landkreis München',
  to: '/lkmuenchen/de',
}

const breadcrumb1: BreadcrumbProps = {
  title: 'Ankommen und Leben in Deutschland',
  to: '/lkmuenchen/de/ankommen-und-leben-in-deutschland',
}

const breadcrumb2: BreadcrumbProps = {
  title: 'Mobilität',
  to: '/lkmuenchen/de/ankommen-und-leben-in-deutschland/mobilitaet',
}

const render = (ancestors: BreadcrumbProps[], current: BreadcrumbProps) =>
  renderWithRouterAndTheme(<Breadcrumbs breadcrumbs={[...ancestors, current]} />)

describe('Breadcrumbs', () => {
  it('should display correctly on the first level', () => {
    const ancestors = [breadcrumb0]
    const { getAllByRole, queryByText } = render(ancestors, breadcrumb0)

    const breadcrumbLink = getAllByRole('link', { name: breadcrumb0.title })
    expect(breadcrumbLink[0]?.getAttribute('href')).toBe(breadcrumb0.to)
    expect(queryByText(breadcrumb1.title)).toBeFalsy()
  })

  it('should display correctly on a lower level', () => {
    const ancestors = [breadcrumb0, breadcrumb1]
    const { getAllByRole, getByRole, queryByText } = render(ancestors, breadcrumb2)

    expect(getAllByRole('link')[0]?.getAttribute('href')).toBe(breadcrumb0.to)
    const breadcrumbLink = getByRole('link', { name: breadcrumb1.title })
    expect(breadcrumbLink.getAttribute('href')).toBe(breadcrumb1.to)
    expect(queryByText(breadcrumb2.title)).toBeTruthy()
  })

  it('should show menu button when there are more than 3 breadcrumbs', () => {
    const ancestors = [homeBreadcrumb, breadcrumb0, breadcrumb1]
    const { getByLabelText } = render(ancestors, breadcrumb2)

    expect(getByLabelText('common:showMore')).toBeTruthy()
  })

  it('should show home icon for first breadcrumb when multiple exist', () => {
    const ancestors = [homeBreadcrumb, breadcrumb0]
    const { getByTestId } = render(ancestors, breadcrumb1)

    expect(getByTestId('HomeOutlinedIcon')).toBeTruthy()
  })
})
