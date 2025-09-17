import { fireEvent } from '@testing-library/react'
import React, { ReactElement } from 'react'

import { renderWithTheme } from '../../testing/render'
import SharingPopupToolbarItem from '../SharingPopupToolbarItem'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')
jest.mock('@mui/material/Tooltip', () => ({ title, children }: { title: string; children: ReactElement }) => (
  <>
    {title}
    {children}
  </>
))

describe('SharingPopupToolbarItem', () => {
  const shareMessage = 'socialMedia:layout:shareMessage'
  const originalWindow = window

  Object.defineProperty(globalThis, 'window', {
    value: {
      ...originalWindow,
      location: {
        ...originalWindow.location,
        href: 'https://integreat.app/augsburg/de/aktuelle-themen-und-informationen',
      },
    },
    writable: true,
  })

  const SharingPopupComponent = (
    <SharingPopupToolbarItem title='Aktuelle Themen und Informationen' flow='horizontal' portalNeeded={false} />
  )

  it('should render correct share link for facebook', () => {
    const facebookShareLink = `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fintegreat.app%2Faugsburg%2Fde%2Faktuelle-themen-und-informationen&t${shareMessage}`
    const { getByLabelText, getByText } = renderWithTheme(SharingPopupComponent)
    fireEvent.click(getByText('socialMedia:layout:share'))

    const iconButtonLink = getByLabelText('socialMedia:facebookTooltip').closest('a')

    expect(iconButtonLink).toBeTruthy()
    expect(iconButtonLink).toHaveAttribute('href', facebookShareLink)
  })

  it('should render correct share link for whatsapp', () => {
    const whatsAppShareLink = `https://api.whatsapp.com/send?text=${shareMessage}%0ahttps%3A%2F%2Fintegreat.app%2Faugsburg%2Fde%2Faktuelle-themen-und-informationen`
    const { getByLabelText, getByText } = renderWithTheme(SharingPopupComponent)
    fireEvent.click(getByText('socialMedia:layout:share'))

    const iconButtonLink = getByLabelText('socialMedia:whatsappTooltip').closest('a')

    expect(iconButtonLink).toBeTruthy()
    expect(iconButtonLink).toHaveAttribute('href', whatsAppShareLink)
  })

  it('should render correct share link for mail', () => {
    const mailShareLink = `mailto:?subject=Aktuelle%20Themen%20und%20Informationen&body=${shareMessage} https%3A%2F%2Fintegreat.app%2Faugsburg%2Fde%2Faktuelle-themen-und-informationen`
    const { getByLabelText, getByText } = renderWithTheme(SharingPopupComponent)
    fireEvent.click(getByText('socialMedia:layout:share'))

    const iconButtonlink = getByLabelText('socialMedia:mailTooltip').closest('a')

    expect(iconButtonlink).toBeTruthy()
    expect(iconButtonlink).toHaveAttribute('href', mailShareLink)
  })
})
