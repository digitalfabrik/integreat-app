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
    expect(getByLabelText('places:website')).toHaveTextContent('places:website')
    expect(getByLabelText('places:phone')).toHaveTextContent(contact.phoneNumber!)
    expect(getByLabelText('places:mobilePhone')).toHaveTextContent(contact.mobileNumber!)
    expect(getByLabelText('places:eMail')).toHaveTextContent(contact.email!)
  })

  it('should render correctly without website', () => {
    const contact = contactBuilder.noWebsite()
    const { getByText, getByLabelText, queryByLabelText } = render(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(queryByLabelText('places:website')).toBeNull()
    expect(getByLabelText('places:phone')).toHaveTextContent(contact.phoneNumber!)
    expect(getByLabelText('places:mobilePhone')).toHaveTextContent(contact.mobileNumber!)
    expect(getByLabelText('places:eMail')).toHaveTextContent(contact.email!)
  })

  it('should render correctly without phone number', () => {
    const contact = contactBuilder.noPhoneNumber()
    const { getByText, getByLabelText, queryByLabelText } = render(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByLabelText('places:website')).toHaveTextContent('places:website')
    expect(queryByLabelText('places:phone')).toBeNull()
    expect(getByLabelText('places:mobilePhone')).toHaveTextContent(contact.mobileNumber!)
    expect(getByLabelText('places:eMail')).toHaveTextContent(contact.email!)
  })

  it('should render correctly without email', () => {
    const contact = contactBuilder.noEmail()
    const { getByText, getByLabelText, queryByLabelText } = render(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByLabelText('places:website')).toHaveTextContent('places:website')
    expect(getByLabelText('places:phone')).toHaveTextContent(contact.phoneNumber!)
    expect(getByLabelText('places:mobilePhone')).toHaveTextContent(contact.mobileNumber!)
    expect(queryByLabelText('places:eMail')).toBeNull()
  })

  it('should render correctly without mobile phone number', () => {
    const contact = contactBuilder.noMobileNumber()
    const { getByText, getByLabelText, queryByLabelText } = render(<Contact contact={contact} />)
    expect(getByText(contact.headline!)).toBeTruthy()
    expect(getByLabelText('places:website')).toHaveTextContent('places:website')
    expect(getByLabelText('places:phone')).toHaveTextContent(contact.phoneNumber!)
    expect(queryByLabelText('places:mobilePhone')).toBeNull()
    expect(getByLabelText('places:eMail')).toHaveTextContent(contact.email!)
  })
})
