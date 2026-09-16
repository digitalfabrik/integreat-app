import React from 'react'

import ContactModelBuilder from 'shared/api/endpoints/testing/ContactModelBuilder'

import render from '../../testing/render'
import Contact from '../Contact'

jest.mock('../base/Icon')

describe('Contact', () => {
  const contactBuilder = new ContactModelBuilder()

  it('should render correctly with all contact information', () => {
    const contact = contactBuilder.everything()
    const { getByLabelText, getByText } = render(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByLabelText('common:contacts.website')).toHaveTextContent('common:contacts.website')
    expect(getByLabelText('common:contacts.phone.title')).toHaveTextContent(contact.phoneNumber!)
    expect(getByLabelText('common:contacts.phone.mobile')).toHaveTextContent(contact.mobileNumber!)
    expect(getByLabelText('common:contacts.email')).toHaveTextContent(contact.email!)
  })

  it('should render correctly without website', () => {
    const contact = contactBuilder.noWebsite()
    const { getByText, getByLabelText, queryByLabelText } = render(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(queryByLabelText('common:contacts.website')).toBeNull()
    expect(getByLabelText('common:contacts.phone.title')).toHaveTextContent(contact.phoneNumber!)
    expect(getByLabelText('common:contacts.phone.mobile')).toHaveTextContent(contact.mobileNumber!)
    expect(getByLabelText('common:contacts.email')).toHaveTextContent(contact.email!)
  })

  it('should render correctly without phone number', () => {
    const contact = contactBuilder.noPhoneNumber()
    const { getByText, getByLabelText, queryByLabelText } = render(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByLabelText('common:contacts.website')).toHaveTextContent('common:contacts.website')
    expect(queryByLabelText('common:contacts.phone.title')).toBeNull()
    expect(getByLabelText('common:contacts.phone.mobile')).toHaveTextContent(contact.mobileNumber!)
    expect(getByLabelText('common:contacts.email')).toHaveTextContent(contact.email!)
  })

  it('should render correctly without email', () => {
    const contact = contactBuilder.noEmail()
    const { getByText, getByLabelText, queryByLabelText } = render(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByLabelText('common:contacts.website')).toHaveTextContent('common:contacts.website')
    expect(getByLabelText('common:contacts.phone.title')).toHaveTextContent(contact.phoneNumber!)
    expect(getByLabelText('common:contacts.phone.mobile')).toHaveTextContent(contact.mobileNumber!)
    expect(queryByLabelText('common:contacts.email')).toBeNull()
  })

  it('should render correctly without mobile phone number', () => {
    const contact = contactBuilder.noMobileNumber()
    const { getByText, getByLabelText, queryByLabelText } = render(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByLabelText('common:contacts.website')).toHaveTextContent('common:contacts.website')
    expect(getByLabelText('common:contacts.phone.title')).toHaveTextContent(contact.phoneNumber!)
    expect(queryByLabelText('common:contacts.phone.mobile')).toBeNull()
    expect(getByLabelText('common:contacts.email')).toHaveTextContent(contact.email!)
  })
})
