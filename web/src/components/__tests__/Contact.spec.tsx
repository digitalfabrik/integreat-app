import React from 'react'

import ContactModelBuilder from 'shared/api/endpoints/testing/ContactModelBuilder'

import { renderWithTheme } from '../../testing/render'
import Contact from '../Contact'

jest.mock('react-i18next')

describe('Contact', () => {
  const contactBuilder = new ContactModelBuilder()

  it('should render correctly with all contact information', () => {
    const contact = contactBuilder.everything()
    const { getByText } = renderWithTheme(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByText(contact.website!)).toBeTruthy()
    expect(getByText(contact.phoneNumber!)).toBeTruthy()
    expect(getByText(contact.mobilePhoneNumber!)).toBeTruthy()
    expect(getByText(contact.email!)).toBeTruthy()
  })

  it('should render correctly without website', () => {
    const contact = contactBuilder.noWebsite()
    const { getByText, queryByText } = renderWithTheme(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(queryByText('https://maria-musterfrau.de')).toBeNull()
    expect(getByText(contact.phoneNumber!)).toBeTruthy()
    expect(getByText(contact.mobilePhoneNumber!)).toBeTruthy()
    expect(getByText(contact.email!)).toBeTruthy()
  })

  it('should render correctly without phone number', () => {
    const contact = contactBuilder.noPhoneNumber()
    const { getByText, queryByText } = renderWithTheme(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByText(contact.website!)).toBeTruthy()
    expect(queryByText('030 1234567')).toBeNull()
    expect(getByText(contact.mobilePhoneNumber!)).toBeTruthy()
    expect(getByText(contact.email!)).toBeTruthy()
  })

  it('should render correctly without email', () => {
    const contact = contactBuilder.noEmail()
    const { getByText, queryByText } = renderWithTheme(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByText(contact.website!)).toBeTruthy()
    expect(getByText(contact.phoneNumber!)).toBeTruthy()
    expect(getByText(contact.mobilePhoneNumber!)).toBeTruthy()
    expect(queryByText('maria@musterfrau.de')).toBeNull()
  })

  it('should render correctly without mobile phone number', () => {
    const contact = contactBuilder.noMobilePhoneNumber()
    const { getByText, queryByText } = renderWithTheme(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByText(contact.website!)).toBeTruthy()
    expect(getByText(contact.phoneNumber!)).toBeTruthy()
    expect(queryByText('0170 1234567')).toBeNull()
    expect(getByText(contact.email!)).toBeTruthy()
  })
})
