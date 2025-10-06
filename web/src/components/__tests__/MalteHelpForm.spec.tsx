import { fireEvent, waitFor } from '@testing-library/dom'
import React from 'react'

import { InvalidEmailError, OfferModel, submitMalteHelpForm } from 'shared/api'

import { renderWithRouterAndTheme, renderWithTheme } from '../../testing/render'
import MalteHelpForm from '../MalteHelpForm'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (namespace?: string) => ({
    t: (key: string) => (namespace ? `${namespace}:${key}` : key),
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  submitMalteHelpForm: jest.fn(),
}))

const submitButtonLabel = 'malteHelpForm:submit'
const nameInputLabel = 'malteHelpForm:name'
const name = 'Doe, Jane'
const roomNumberInputLabel = 'malteHelpForm:roomNumber (malteHelpForm:common:optional)'
const roomNumber = '42'
const emailInputLabel = 'malteHelpForm:eMail'
const email = 'testEmail@tuerantuer.org'
const phoneInputLabel = 'malteHelpForm:telephone'
const phoneNumber = '0049 160 12345678'
const personalContactLabel = 'malteHelpForm:personally'
const femaleContactLabel = 'malteHelpForm:contactPersonGenderFemale'
const maleContactLabel = 'malteHelpForm:contactPersonGenderMale'
const messageInputLabel = 'malteHelpForm:contactReason'
const message =
  "Hello, I can't figure out how to open my window for my contractually agreed daily Lüften, can you help me?"

describe('MalteHelpForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const offer = new OfferModel({
    alias: 'help',
    title: 'Hilfebutton',
    path: 'https://zammad-malte.tuerantuer.org',
    thumbnail: '',
  })

  const props = {
    cityCode: 'testumgebung',
    pageTitle: 'Kontaktformular',
    languageCode: 'de',
    malteHelpFormOffer: offer,
  }

  it('should submit the form successfully with an email', () => {
    const { getByLabelText, getByText, getAllByLabelText } = renderWithTheme(<MalteHelpForm {...props} />)

    const submitButton = getByText(submitButtonLabel)
    fireEvent.click(submitButton)
    expect(submitMalteHelpForm).not.toHaveBeenCalled()

    const nameInput = getByLabelText(nameInputLabel, { exact: false })
    fireEvent.change(nameInput, { target: { value: name } })

    const roomNumberInput = getByLabelText(roomNumberInputLabel, { exact: false })
    fireEvent.change(roomNumberInput, { target: { value: roomNumber } })

    const emailInput = getAllByLabelText(emailInputLabel, { exact: false })[1]!
    fireEvent.change(emailInput, { target: { value: email } })

    const messageInput = getByLabelText(messageInputLabel, { exact: false })
    fireEvent.change(messageInput, { target: { value: message } })
    fireEvent.click(getByText('common:privacyPolicy'))

    fireEvent.click(submitButton)
    expect(submitMalteHelpForm).toHaveBeenCalledWith(
      expect.objectContaining({
        comment: message,
        contactChannel: 'email',
        contactGender: 'any',
        email,
        name,
        roomNumber,
        telephone: '',
      }),
    )
  })

  it('should submit the form successfully with a phone number', () => {
    const { getByLabelText, getByText, getAllByLabelText } = renderWithTheme(<MalteHelpForm {...props} />)

    const submitButton = getByText(submitButtonLabel)
    fireEvent.click(submitButton)
    expect(submitMalteHelpForm).not.toHaveBeenCalled()

    const nameInput = getByLabelText(nameInputLabel, { exact: false })
    fireEvent.change(nameInput, { target: { value: name } })

    const roomNumberInput = getByLabelText(roomNumberInputLabel, { exact: false })
    fireEvent.change(roomNumberInput, { target: { value: roomNumber } })

    const phoneButton = getByLabelText(phoneInputLabel, { exact: false })
    expect(phoneButton).not.toBeChecked()
    fireEvent.click(phoneButton)
    expect(phoneButton).toBeChecked()

    const phoneInput = getAllByLabelText(phoneInputLabel, { exact: false })[1]!
    fireEvent.change(phoneInput, { target: { value: phoneNumber } })
    fireEvent.click(getByText('common:privacyPolicy'))

    const messageInput = getByLabelText(messageInputLabel, { exact: false })
    fireEvent.change(messageInput, { target: { value: message } })

    fireEvent.click(submitButton)
    expect(submitMalteHelpForm).toHaveBeenCalledWith(
      expect.objectContaining({
        comment: message,
        contactChannel: 'telephone',
        contactGender: 'any',
        email: '',
        name,
        roomNumber,
        telephone: phoneNumber,
      }),
    )
  })

  it('should submit the form successfully with a request for contact in person', () => {
    const { getByLabelText, getByText, getAllByLabelText } = renderWithTheme(<MalteHelpForm {...props} />)

    const submitButton = getByText(submitButtonLabel)
    fireEvent.click(submitButton)
    expect(submitMalteHelpForm).not.toHaveBeenCalled()

    const nameInput = getByLabelText(nameInputLabel, { exact: false })
    fireEvent.change(nameInput, { target: { value: name } })

    const roomNumberInput = getByLabelText(roomNumberInputLabel, { exact: false })
    fireEvent.change(roomNumberInput, { target: { value: roomNumber } })

    const personalContactButton = getAllByLabelText(personalContactLabel)[0]!
    expect(personalContactButton).not.toBeChecked()
    fireEvent.click(personalContactButton)
    expect(personalContactButton).toBeChecked()
    fireEvent.click(getByText('common:privacyPolicy'))

    const messageInput = getByLabelText(messageInputLabel, { exact: false })
    fireEvent.change(messageInput, { target: { value: message } })

    fireEvent.click(submitButton)
    expect(submitMalteHelpForm).toHaveBeenCalledWith(
      expect.objectContaining({
        comment: message,
        contactChannel: 'personally',
        contactGender: 'any',
        email: '',
        name,
        roomNumber,
        telephone: '',
      }),
    )
  })

  it('should submit the form successfully with a request to be contacted by a woman', () => {
    const { getByLabelText, getByText, getAllByLabelText } = renderWithTheme(<MalteHelpForm {...props} />)

    const submitButton = getByText(submitButtonLabel)
    fireEvent.click(submitButton)
    expect(submitMalteHelpForm).not.toHaveBeenCalled()

    const nameInput = getByLabelText(nameInputLabel, { exact: false })
    fireEvent.change(nameInput, { target: { value: name } })

    const roomNumberInput = getByLabelText(roomNumberInputLabel, { exact: false })
    fireEvent.change(roomNumberInput, { target: { value: roomNumber } })

    const personalContactButton = getAllByLabelText(personalContactLabel)[0]!
    expect(personalContactButton).not.toBeChecked()
    fireEvent.click(personalContactButton)
    expect(personalContactButton).toBeChecked()
    fireEvent.click(getByText('common:privacyPolicy'))

    const femaleContactButton = getByLabelText(femaleContactLabel, { exact: false })
    expect(femaleContactButton).not.toBeChecked()
    fireEvent.click(femaleContactButton)
    expect(femaleContactButton).toBeChecked()

    const messageInput = getByLabelText(messageInputLabel, { exact: false })
    fireEvent.change(messageInput, { target: { value: message } })

    fireEvent.click(submitButton)
    expect(submitMalteHelpForm).toHaveBeenCalledWith(
      expect.objectContaining({
        comment: message,
        contactChannel: 'personally',
        contactGender: 'female',
        email: '',
        name,
        roomNumber,
        telephone: '',
      }),
    )
  })

  it('should submit the form successfully with a request to be contacted by a man', () => {
    const { getByLabelText, getByText, getAllByLabelText } = renderWithTheme(<MalteHelpForm {...props} />)

    const submitButton = getByText(submitButtonLabel)
    fireEvent.click(submitButton)
    expect(submitMalteHelpForm).not.toHaveBeenCalled()

    const nameInput = getByLabelText(nameInputLabel, { exact: false })
    fireEvent.change(nameInput, { target: { value: name } })

    const roomNumberInput = getByLabelText(roomNumberInputLabel, { exact: false })
    fireEvent.change(roomNumberInput, { target: { value: roomNumber } })

    const personalContactButton = getAllByLabelText(personalContactLabel)[0]!
    expect(personalContactButton).not.toBeChecked()
    fireEvent.click(personalContactButton)
    expect(personalContactButton).toBeChecked()
    fireEvent.click(getByText('common:privacyPolicy'))

    const maleContactButton = getByLabelText(maleContactLabel, { exact: false })
    expect(maleContactButton).not.toBeChecked()
    fireEvent.click(maleContactButton)
    expect(maleContactButton).toBeChecked()

    const messageInput = getByLabelText(messageInputLabel, { exact: false })
    fireEvent.change(messageInput, { target: { value: message } })

    fireEvent.click(submitButton)
    expect(submitMalteHelpForm).toHaveBeenCalledWith(
      expect.objectContaining({
        comment: message,
        contactChannel: 'personally',
        contactGender: 'male',
        email: '',
        name,
        roomNumber,
        telephone: '',
      }),
    )
  })

  it('should not submit if the name is empty', () => {
    const { getByLabelText, getAllByLabelText, getByText } = renderWithTheme(<MalteHelpForm {...props} />)

    const submitButton = getByText(submitButtonLabel)

    const roomNumberInput = getByLabelText(roomNumberInputLabel, { exact: false })
    fireEvent.change(roomNumberInput, { target: { value: roomNumber } })

    const emailInput = getAllByLabelText(emailInputLabel, { exact: false })[1]!
    fireEvent.change(emailInput, { target: { value: email } })

    const messageInput = getByLabelText(messageInputLabel, { exact: false })
    fireEvent.change(messageInput, { target: { value: message } })

    fireEvent.click(submitButton)
    expect(submitMalteHelpForm).not.toHaveBeenCalled()
  })

  it('should show an error if Zammad says the email address is invalid', async () => {
    jest.mocked(submitMalteHelpForm).mockImplementation(() => {
      throw new InvalidEmailError()
    })
    const { getByLabelText, getAllByLabelText, getByText } = renderWithRouterAndTheme(<MalteHelpForm {...props} />)

    const submitButton = getByText(submitButtonLabel)

    const nameInput = getByLabelText(nameInputLabel, { exact: false })
    fireEvent.change(nameInput, { target: { value: name } })

    const roomNumberInput = getByLabelText(roomNumberInputLabel, { exact: false })
    fireEvent.change(roomNumberInput, { target: { value: roomNumber } })

    const emailInput = getAllByLabelText(emailInputLabel, { exact: false })[1]!
    fireEvent.change(emailInput, { target: { value: 'email' } })
    fireEvent.click(getByText('common:privacyPolicy'))

    const messageInput = getByLabelText(messageInputLabel, { exact: false })
    fireEvent.change(messageInput, { target: { value: message } })

    fireEvent.click(submitButton)
    expect(submitMalteHelpForm).toHaveBeenCalledWith(
      expect.objectContaining({
        comment: message,
        contactChannel: 'email',
        contactGender: 'any',
        email: 'email',
        name,
        roomNumber,
        telephone: '',
      }),
    )

    await waitFor(() => expect(getByText('malteHelpForm:submitFailed')).toBeInTheDocument())
  })

  it('should show an error if there is another error while sending to Zammad', async () => {
    jest.mocked(submitMalteHelpForm).mockImplementation(() => {
      throw new Error()
    })
    global.reportError = jest.fn()

    const { getByLabelText, getAllByLabelText, getByText } = renderWithRouterAndTheme(<MalteHelpForm {...props} />)

    const submitButton = getByText(submitButtonLabel)

    const nameInput = getByLabelText(nameInputLabel, { exact: false })
    fireEvent.change(nameInput, { target: { value: name } })

    const roomNumberInput = getByLabelText(roomNumberInputLabel, { exact: false })
    fireEvent.change(roomNumberInput, { target: { value: roomNumber } })

    const emailInput = getAllByLabelText(emailInputLabel, { exact: false })[1]!
    fireEvent.change(emailInput, { target: { value: email } })
    fireEvent.click(getByText('common:privacyPolicy'))

    const messageInput = getByLabelText(messageInputLabel, { exact: false })
    fireEvent.change(messageInput, { target: { value: message } })

    fireEvent.click(submitButton)
    expect(submitMalteHelpForm).toHaveBeenCalledWith(
      expect.objectContaining({
        comment: message,
        contactChannel: 'email',
        contactGender: 'any',
        email,
        name,
        roomNumber,
        telephone: '',
      }),
    )

    await waitFor(() => expect(getByText('malteHelpForm:submitFailedReasoning')).toBeInTheDocument())
  })
})
