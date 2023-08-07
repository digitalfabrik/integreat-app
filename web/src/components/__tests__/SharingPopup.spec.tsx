import React from 'react'

import { TU_NEWS_ROUTE } from '../../routes'
import { renderWithTheme } from '../../testing/render'
import SharingPopup from '../SharingPopup'

describe('SharingPopup', () => {
  const onClose = jest.fn()

  const SharingPopupComponent = (
    <SharingPopup
      direction='ltr'
      title='Aktuelle Themen und Informationen'
      onClose={onClose}
      active
      flow='right'
      shareLink='https://integreat.app/augsburg/de/aktuelle-themen-und-informationen'
      route={TU_NEWS_ROUTE}>
      ShareButton
    </SharingPopup>
  )

  it('should render correct share link for facebook', () => {
    const facebookShareLink =
      'http://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fintegreat.app%2Faugsburg%2Fde%2Faktuelle-themen-und-informationen&tAktuelle%20Themen%20und%20Informationen'
    const { getByTestId } = renderWithTheme(SharingPopupComponent)
    expect(getByTestId('facebook')).toBeTruthy()
    expect(getByTestId('facebook')).toHaveAttribute('href', facebookShareLink)
  })

  it('should render correct share link for whatsapp', () => {
    const whatsAppShareLink =
      'https://api.whatsapp.com/send?text=Aktuelle%20Themen%20und%20Informationen%0ahttps%3A%2F%2Fintegreat.app%2Faugsburg%2Fde%2Faktuelle-themen-und-informationen'
    const { getByTestId } = renderWithTheme(SharingPopupComponent)
    expect(getByTestId('whatsapp')).toBeTruthy()
    expect(getByTestId('whatsapp')).toHaveAttribute('href', whatsAppShareLink)
  })

  it('should render correct share link for mail', () => {
    const mailShareLink =
      'mailto:?subject=Aktuelle%20Themen%20und%20Informationen&body=https%3A%2F%2Fintegreat.app%2Faugsburg%2Fde%2Faktuelle-themen-und-informationen'
    const { getByTestId } = renderWithTheme(SharingPopupComponent)
    expect(getByTestId('mail')).toBeTruthy()
    expect(getByTestId('mail')).toHaveAttribute('href', mailShareLink)
  })
})
