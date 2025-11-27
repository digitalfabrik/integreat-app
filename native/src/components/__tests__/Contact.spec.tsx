import React from 'react'

import ContactModelBuilder from 'shared/api/endpoints/testing/ContactModelBuilder'

import render from '../../testing/render'
import Contact from '../Contact'

jest.mock('react-i18next')

describe('Contact', () => {
  const contactBuilder = new ContactModelBuilder()

  it('should render correctly with all contact information', () => {
    const contact = contactBuilder.everything()
    const { getByLabelText, getByText } = render(<Contact contact={contact} language='de' />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByLabelText('website')).toHaveTextContent('website')
    expect(getByLabelText('phone')).toHaveTextContent(contact.phoneNumber!)
    expect(getByLabelText('mobilePhone')).toHaveTextContent(contact.mobileNumber!)
    expect(getByLabelText('eMail')).toHaveTextContent(contact.email!)
  })

  it('should render correctly without website', () => {
    const contact = contactBuilder.noWebsite()
    const { getByText, getByLabelText, queryByLabelText } = render(<Contact contact={contact} language='de' />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(queryByLabelText('website')).toBeNull()
    expect(getByLabelText('phone')).toHaveTextContent(contact.phoneNumber!)
    expect(getByLabelText('mobilePhone')).toHaveTextContent(contact.mobileNumber!)
    expect(getByLabelText('eMail')).toHaveTextContent(contact.email!)
  })

  it('should render correctly without phone number', () => {
    const contact = contactBuilder.noPhoneNumber()
    const { getByText, getByLabelText, queryByLabelText } = render(<Contact contact={contact} language='de' />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByLabelText('website')).toHaveTextContent('website')
    expect(queryByLabelText('phone')).toBeNull()
    expect(getByLabelText('mobilePhone')).toHaveTextContent(contact.mobileNumber!)
    expect(getByLabelText('eMail')).toHaveTextContent(contact.email!)
  })

  it('should render correctly without email', () => {
    const contact = contactBuilder.noEmail()
    const { getByText, getByLabelText, queryByLabelText } = render(<Contact contact={contact} language='de' />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByLabelText('website')).toHaveTextContent('website')
    expect(getByLabelText('phone')).toHaveTextContent(contact.phoneNumber!)
    expect(getByLabelText('mobilePhone')).toHaveTextContent(contact.mobileNumber!)
    expect(queryByLabelText('eMail')).toBeNull()
  })

  it('should render correctly without mobile phone number', () => {
    const contact = contactBuilder.noMobileNumber()
    const { getByText, getByLabelText, queryByLabelText } = render(<Contact contact={contact} language='de' />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByLabelText('website')).toHaveTextContent('website')
    expect(getByLabelText('phone')).toHaveTextContent(contact.phoneNumber!)
    expect(queryByLabelText('mobilePhone')).toBeNull()
    expect(getByLabelText('eMail')).toHaveTextContent(contact.email!)
  })
})
