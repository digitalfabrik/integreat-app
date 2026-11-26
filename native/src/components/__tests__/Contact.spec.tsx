import React from 'react'

import ContactModelBuilder from 'shared/api/endpoints/testing/ContactModelBuilder'

import render from '../../testing/render'
import Contact from '../Contact'

jest.mock('../base/Icon')

describe('Contact', () => {
  const contactBuilder = new ContactModelBuilder()

  it('should render correctly with all contact information', async () => {
    const contact = contactBuilder.everything()
    const { getByLabelText, getByText } = await render(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByLabelText('common:contacts.website')).toHaveTextContent('common:contacts.website')
    expect(getByLabelText('common:contacts.phone.title')).toHaveTextContent(contact.phoneNumber!)
    expect(getByLabelText('common:contacts.phone.mobile')).toHaveTextContent(contact.mobileNumber!)
    expect(getByLabelText('common:contacts.email')).toHaveTextContent(contact.email!)
  })

  it('should render correctly without website', async () => {
    const contact = contactBuilder.noWebsite()
    const { getByText, getByLabelText, queryByLabelText } = await render(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(queryByLabelText('common:contacts.website')).toBeNull()
    expect(getByLabelText('common:contacts.phone.title')).toHaveTextContent(contact.phoneNumber!)
    expect(getByLabelText('common:contacts.phone.mobile')).toHaveTextContent(contact.mobileNumber!)
    expect(getByLabelText('common:contacts.email')).toHaveTextContent(contact.email!)
  })

  it('should render correctly without phone number', async () => {
    const contact = contactBuilder.noPhoneNumber()
    const { getByText, getByLabelText, queryByLabelText } = await render(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByLabelText('common:contacts.website')).toHaveTextContent('common:contacts.website')
    expect(queryByLabelText('common:contacts.phone.title')).toBeNull()
    expect(getByLabelText('common:contacts.phone.mobile')).toHaveTextContent(contact.mobileNumber!)
    expect(getByLabelText('common:contacts.email')).toHaveTextContent(contact.email!)
  })

  it('should render correctly without email', async () => {
    const contact = contactBuilder.noEmail()
    const { getByText, getByLabelText, queryByLabelText } = await render(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByLabelText('common:contacts.website')).toHaveTextContent('common:contacts.website')
    expect(getByLabelText('common:contacts.phone.title')).toHaveTextContent(contact.phoneNumber!)
    expect(getByLabelText('common:contacts.phone.mobile')).toHaveTextContent(contact.mobileNumber!)
    expect(queryByLabelText('common:contacts.email')).toBeNull()
  })

  it('should render correctly without mobile phone number', async () => {
    const contact = contactBuilder.noMobileNumber()
    const { getByText, getByLabelText, queryByLabelText } = await render(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByLabelText('common:contacts.website')).toHaveTextContent('common:contacts.website')
    expect(getByLabelText('common:contacts.phone.title')).toHaveTextContent(contact.phoneNumber!)
    expect(queryByLabelText('common:contacts.phone.mobile')).toBeNull()
    expect(getByLabelText('common:contacts.email')).toHaveTextContent(contact.email!)
  })
})
