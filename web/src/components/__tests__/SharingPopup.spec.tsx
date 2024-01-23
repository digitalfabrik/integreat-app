import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTheme } from '../../testing/render'
import SharingPopup from '../SharingPopup'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')

describe('SharingPopup', () => {
  const shareMessage = 'socialMedia:layout:shareMessage'

  const SharingPopupComponent = (
    <SharingPopup
      title='Aktuelle Themen und Informationen'
      flow='horizontal'
      shareUrl='https://integreat.app/augsburg/de/aktuelle-themen-und-informationen'
      portalNeeded={false}
    />
  )

  it('should render correct share link for facebook', () => {
    const facebookShareLink = `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fintegreat.app%2Faugsburg%2Fde%2Faktuelle-themen-und-informationen&t${shareMessage}`
    const { getAllByLabelText, getByText } = renderWithTheme(SharingPopupComponent)
    fireEvent.click(getByText('socialMedia:layout:share'))
    expect(getAllByLabelText('socialMedia:facebookTooltip')[0]).toBeTruthy()
    expect(getAllByLabelText('socialMedia:facebookTooltip')[0]).toHaveAttribute('href', facebookShareLink)
  })

  it('should render correct share link for whatsapp', () => {
    const whatsAppShareLink = `https://api.whatsapp.com/send?text=${shareMessage}%0ahttps%3A%2F%2Fintegreat.app%2Faugsburg%2Fde%2Faktuelle-themen-und-informationen`
    const { getAllByLabelText, getByText } = renderWithTheme(SharingPopupComponent)
    fireEvent.click(getByText('socialMedia:layout:share'))
    expect(getAllByLabelText('socialMedia:whatsappTooltip')[0]).toBeTruthy()
    expect(getAllByLabelText('socialMedia:whatsappTooltip')[0]).toHaveAttribute('href', whatsAppShareLink)
  })

  it('should render correct share link for mail', () => {
    const mailShareLink = `mailto:?subject=Aktuelle%20Themen%20und%20Informationen&body=${shareMessage}https%3A%2F%2Fintegreat.app%2Faugsburg%2Fde%2Faktuelle-themen-und-informationen`
    const { getAllByLabelText, getByText } = renderWithTheme(SharingPopupComponent)
    fireEvent.click(getByText('socialMedia:layout:share'))
    expect(getAllByLabelText('socialMedia:mailTooltip')[0]).toBeTruthy()
    expect(getAllByLabelText('socialMedia:mailTooltip')[0]).toHaveAttribute('href', mailShareLink)
  })
})
