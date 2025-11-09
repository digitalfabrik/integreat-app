import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import { BreadcrumbProps } from '../Breadcrumb'
import Breadcrumbs from '../Breadcrumbs'

jest.mock('react-i18next')

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

const breadcrumb3: BreadcrumbProps = {
  title: 'Mobilitätsförderung',
  to: '/lkmuenchen/de/ankommen-und-leben-in-deutschland/mobilitaet/foerderung',
}

const breadcrumb4: BreadcrumbProps = {
  title: 'Mobilitätsförderungsdetails',
  to: '/lkmuenchen/de/ankommen-und-leben-in-deutschland/mobilitaet/foerderung/details',
}

const render = (ancestors: BreadcrumbProps[], current: BreadcrumbProps) =>
  renderWithRouterAndTheme(<Breadcrumbs breadcrumbs={[...ancestors, current]} />)

describe('Breadcrumbs', () => {
  it('should display correctly on the first level', () => {
    const ancestors = [breadcrumb0]
    const { getAllByRole, queryByText } = render(ancestors, breadcrumb1)

    const breadcrumbLink = getAllByRole('link', { name: breadcrumb0.title })
    expect(breadcrumbLink[0]?.getAttribute('href')).toBe(breadcrumb0.to)
    expect(queryByText(breadcrumb1.title)).toBeFalsy()
  })

  it('should display correctly on a lower level', () => {
    const ancestors = [breadcrumb0, breadcrumb1]
    const { getAllByRole, queryByText } = render(ancestors, breadcrumb2)

    const firstBreadcrumbLink = getAllByRole('link')[0]
    expect(firstBreadcrumbLink?.getAttribute('href')).toBe(breadcrumb0.to)
    expect(firstBreadcrumbLink).toHaveTextContent('')
    const secondBreadcrumbLink = getAllByRole('link')[1]
    expect(secondBreadcrumbLink?.getAttribute('href')).toBe(breadcrumb1.to)
    expect(secondBreadcrumbLink).toHaveTextContent(breadcrumb1.title)
    expect(queryByText(breadcrumb2.title)).toBeFalsy()
  })

  it('should show menu button when there are more than 4 breadcrumbs', () => {
    const ancestors = [breadcrumb0, breadcrumb1, breadcrumb2, breadcrumb3]
    const { getByLabelText } = render(ancestors, breadcrumb4)

    expect(getByLabelText('common:showMore')).toBeTruthy()
  })

  it('should show home icon for first breadcrumb when multiple exist', () => {
    const ancestors = [breadcrumb0, breadcrumb1]
    const { getByTestId } = render(ancestors, breadcrumb2)

    expect(getByTestId('HomeOutlinedIcon')).toBeTruthy()
  })
})
