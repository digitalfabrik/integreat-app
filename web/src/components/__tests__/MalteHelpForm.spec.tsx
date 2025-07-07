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
    const { getByLabelText, getByText, getByPlaceholderText } = renderWithTheme(<MalteHelpForm {...props} />)

    const submitButton = getByText(submitButtonLabel)
    expect(submitButton).toBeDisabled()

    const nameInput = getByPlaceholderText(nameInputLabel)
    fireEvent.change(nameInput, { target: { value: name } })
    expect(submitButton).toBeDisabled()

    const roomNumberInput = getByLabelText(roomNumberInputLabel)
    fireEvent.change(roomNumberInput, { target: { value: roomNumber } })
    expect(submitButton).toBeDisabled()

    const emailInput = getByPlaceholderText(emailInputLabel)
    fireEvent.change(emailInput, { target: { value: email } })
    fireEvent.click(getByText('common:privacyPolicy'))
    expect(submitButton).toBeEnabled()

    const messageInput = getByLabelText(messageInputLabel)
    fireEvent.change(messageInput, { target: { value: message } })
    expect(submitButton).toBeEnabled()

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
    const { getByLabelText, getByText, getAllByLabelText, getByPlaceholderText } = renderWithTheme(
      <MalteHelpForm {...props} />,
    )

    const submitButton = getByText(submitButtonLabel)
    expect(submitButton).toBeDisabled()

    const nameInput = getByPlaceholderText(nameInputLabel)
    fireEvent.change(nameInput, { target: { value: name } })
    expect(submitButton).toBeDisabled()

    const roomNumberInput = getByLabelText(roomNumberInputLabel)
    fireEvent.change(roomNumberInput, { target: { value: roomNumber } })
    expect(submitButton).toBeDisabled()

    const phoneButton = getAllByLabelText(phoneInputLabel)[0]!
    expect(phoneButton).not.toBeChecked()
    fireEvent.click(phoneButton)
    expect(phoneButton).toBeChecked()
    expect(submitButton).toBeDisabled()

    const phoneInput = getByPlaceholderText(phoneInputLabel)!
    fireEvent.change(phoneInput, { target: { value: phoneNumber } })
    fireEvent.click(getByText('common:privacyPolicy'))
    expect(submitButton).toBeEnabled()

    const messageInput = getByLabelText(messageInputLabel)
    fireEvent.change(messageInput, { target: { value: message } })
    expect(submitButton).toBeEnabled()

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
    const { getByLabelText, getByText, getAllByLabelText, getByPlaceholderText } = renderWithTheme(
      <MalteHelpForm {...props} />,
    )

    const submitButton = getByText(submitButtonLabel)
    expect(submitButton).toBeDisabled()

    const nameInput = getByPlaceholderText(nameInputLabel)
    fireEvent.change(nameInput, { target: { value: name } })
    expect(submitButton).toBeDisabled()

    const roomNumberInput = getByLabelText(roomNumberInputLabel)
    fireEvent.change(roomNumberInput, { target: { value: roomNumber } })
    expect(submitButton).toBeDisabled()

    const personalContactButton = getAllByLabelText(personalContactLabel)[0]!
    expect(personalContactButton).not.toBeChecked()
    fireEvent.click(personalContactButton)
    expect(personalContactButton).toBeChecked()
    fireEvent.click(getByText('common:privacyPolicy'))
    expect(submitButton).toBeEnabled()

    const messageInput = getByLabelText(messageInputLabel)
    fireEvent.change(messageInput, { target: { value: message } })
    expect(submitButton).toBeEnabled()

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
    const { getByLabelText, getByText, getAllByLabelText, getByPlaceholderText } = renderWithTheme(
      <MalteHelpForm {...props} />,
    )

    const submitButton = getByText(submitButtonLabel)
    expect(submitButton).toBeDisabled()

    const nameInput = getByPlaceholderText(nameInputLabel)
    fireEvent.change(nameInput, { target: { value: name } })
    expect(submitButton).toBeDisabled()

    const roomNumberInput = getByLabelText(roomNumberInputLabel)
    fireEvent.change(roomNumberInput, { target: { value: roomNumber } })
    expect(submitButton).toBeDisabled()

    const personalContactButton = getAllByLabelText(personalContactLabel)[0]!
    expect(personalContactButton).not.toBeChecked()
    fireEvent.click(personalContactButton)
    expect(personalContactButton).toBeChecked()
    fireEvent.click(getByText('common:privacyPolicy'))
    expect(submitButton).toBeEnabled()

    const femaleContactButton = getByLabelText(femaleContactLabel)
    expect(femaleContactButton).not.toBeChecked()
    fireEvent.click(femaleContactButton)
    expect(femaleContactButton).toBeChecked()
    expect(submitButton).toBeEnabled()

    const messageInput = getByLabelText(messageInputLabel)
    fireEvent.change(messageInput, { target: { value: message } })
    expect(submitButton).toBeEnabled()

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
    const { getByLabelText, getByText, getAllByLabelText, getByPlaceholderText } = renderWithTheme(
      <MalteHelpForm {...props} />,
    )

    const submitButton = getByText(submitButtonLabel)
    expect(submitButton).toBeDisabled()

    const nameInput = getByPlaceholderText(nameInputLabel)
    fireEvent.change(nameInput, { target: { value: name } })
    expect(submitButton).toBeDisabled()

    const roomNumberInput = getByLabelText(roomNumberInputLabel)
    fireEvent.change(roomNumberInput, { target: { value: roomNumber } })
    expect(submitButton).toBeDisabled()

    const personalContactButton = getAllByLabelText(personalContactLabel)[0]!
    expect(personalContactButton).not.toBeChecked()
    fireEvent.click(personalContactButton)
    expect(personalContactButton).toBeChecked()
    fireEvent.click(getByText('common:privacyPolicy'))
    expect(submitButton).toBeEnabled()

    const maleContactButton = getByLabelText(maleContactLabel)
    expect(maleContactButton).not.toBeChecked()
    fireEvent.click(maleContactButton)
    expect(maleContactButton).toBeChecked()
    expect(submitButton).toBeEnabled()

    const messageInput = getByLabelText(messageInputLabel)
    fireEvent.change(messageInput, { target: { value: message } })
    expect(submitButton).toBeEnabled()

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
    const { getByLabelText, getByText, getByPlaceholderText } = renderWithTheme(<MalteHelpForm {...props} />)

    const submitButton = getByText(submitButtonLabel)
    expect(submitButton).toBeDisabled()

    const roomNumberInput = getByLabelText(roomNumberInputLabel)
    fireEvent.change(roomNumberInput, { target: { value: roomNumber } })
    expect(submitButton).toBeDisabled()

    const emailInput = getByPlaceholderText(emailInputLabel)!
    fireEvent.change(emailInput, { target: { value: email } })
    expect(submitButton).toBeDisabled()

    const messageInput = getByLabelText(messageInputLabel)
    fireEvent.change(messageInput, { target: { value: message } })
    expect(submitButton).toBeDisabled()

    fireEvent.click(submitButton)
    expect(submitMalteHelpForm).not.toHaveBeenCalled()
  })

  it('should show an error if Zammad says the email address is invalid', async () => {
    jest.mocked(submitMalteHelpForm).mockImplementation(() => {
      throw new InvalidEmailError()
    })
    const { getByLabelText, getByText, getByPlaceholderText } = renderWithRouterAndTheme(<MalteHelpForm {...props} />)

    const submitButton = getByText(submitButtonLabel)
    expect(submitButton).toBeDisabled()

    const nameInput = getByPlaceholderText(nameInputLabel)
    fireEvent.change(nameInput, { target: { value: name } })
    expect(submitButton).toBeDisabled()

    const roomNumberInput = getByLabelText(roomNumberInputLabel)
    fireEvent.change(roomNumberInput, { target: { value: roomNumber } })
    expect(submitButton).toBeDisabled()

    const emailInput = getByPlaceholderText(emailInputLabel)!
    fireEvent.change(emailInput, { target: { value: 'email' } })
    fireEvent.click(getByText('common:privacyPolicy'))
    expect(submitButton).toBeEnabled()

    const messageInput = getByLabelText(messageInputLabel)
    fireEvent.change(messageInput, { target: { value: message } })
    expect(submitButton).toBeEnabled()

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

    const { getByLabelText, getByText, getByPlaceholderText } = renderWithRouterAndTheme(<MalteHelpForm {...props} />)

    const submitButton = getByText(submitButtonLabel)
    expect(submitButton).toBeDisabled()

    const nameInput = getByPlaceholderText(nameInputLabel)
    fireEvent.change(nameInput, { target: { value: name } })
    expect(submitButton).toBeDisabled()

    const roomNumberInput = getByLabelText(roomNumberInputLabel)
    fireEvent.change(roomNumberInput, { target: { value: roomNumber } })
    expect(submitButton).toBeDisabled()

    const emailInput = getByPlaceholderText(emailInputLabel)!
    fireEvent.change(emailInput, { target: { value: email } })
    fireEvent.click(getByText('common:privacyPolicy'))
    expect(submitButton).toBeEnabled()

    const messageInput = getByLabelText(messageInputLabel)
    fireEvent.change(messageInput, { target: { value: message } })
    expect(submitButton).toBeEnabled()

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
