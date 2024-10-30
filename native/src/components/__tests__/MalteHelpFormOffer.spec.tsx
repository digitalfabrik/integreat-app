import { userEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'

import { InvalidEmailError, OfferModel, submitMalteHelpForm } from 'shared/api'

import renderWithTheme from '../../testing/render'
import MalteHelpFormOffer from '../MalteHelpFormOffer'

jest.mock('react-i18next')
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  submitMalteHelpForm: jest.fn(),
}))
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext)
const mockShowSnackbar = jest.fn()
jest.mock('../../hooks/useSnackbar.ts', () => ({
  __esModule: true,
  default: () => mockShowSnackbar,
}))

const submitButtonLabel = 'submit'
const nameInputLabel = 'name'
const name = 'Doe, Jane'
const roomNumberInputLabel = 'roomNumber'
const roomNumber = '42'
const emailInputLabel = 'email'
const email = 'testEmail@tuerantuer.org'
const phoneInputLabel = 'telephone'
const phoneNumber = '0049 160 12345678'
const personalContactLabel = 'personally'
const femaleContactLabel = 'contactPersonGenderFemale'
const maleContactLabel = 'contactPersonGenderMale'
const messageInputLabel = 'contactReason'
const message =
  "Hello, I can't figure out how to open my window for my contractually agreed daily Lüften, can you help me?"

// Typescript shenanigans to be able to use mockImplementation in the tests
const mockedSubmitMalteHelpForm = submitMalteHelpForm as jest.MockedFunction<typeof submitMalteHelpForm>

describe('MalteHelpFormOffer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  const user = userEvent.setup({
    advanceTimers: () => jest.advanceTimersByTime(1000),
  })

  const offer = new OfferModel({
    alias: 'help',
    title: 'Hilfebutton',
    path: 'https://zammad-malte.tuerantuer.org',
    thumbnail: '',
  })

  const props = {
    categoryPageTitle: 'Kontaktformular',
    cityCode: 'testumgebung',
    malteHelpFormOffer: offer,
    url: '',
    onSubmit: jest.fn(),
  }

  it('should submit the form successfully with an email', async () => {
    const { getByText, getByTestId } = renderWithTheme(<MalteHelpFormOffer {...props} />)

    const submitButton = getByText(submitButtonLabel)
    expect(submitButton).toBeDisabled()

    const nameInput = getByTestId(nameInputLabel)
    await user.type(nameInput, name)
    expect(nameInput.props.value).toBe(name)
    expect(submitButton).toBeDisabled()

    const roomNumberInput = getByTestId(roomNumberInputLabel)
    await user.type(roomNumberInput, roomNumber)
    expect(roomNumberInput.props.value).toBe(roomNumber)
    expect(submitButton).toBeDisabled()

    const emailInput = getByTestId(emailInputLabel)
    await user.type(emailInput, email)
    expect(emailInput.props.value).toBe(email)
    expect(submitButton).toBeEnabled()

    const messageInput = getByTestId(messageInputLabel)
    await user.type(messageInput, message)
    expect(messageInput.props.value).toBe(message)
    expect(submitButton).toBeEnabled()

    await user.press(submitButton)
    expect(mockedSubmitMalteHelpForm).toHaveBeenCalledWith(
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

    expect(mockShowSnackbar).toHaveBeenCalledWith({ text: 'submitSuccessful' })
  })

  it('should submit the form successfully with a phone number', async () => {
    const { getByText, getByTestId } = renderWithTheme(<MalteHelpFormOffer {...props} />)

    const submitButton = getByText(submitButtonLabel)
    expect(submitButton).toBeDisabled()

    const nameInput = getByTestId(nameInputLabel)
    await user.type(nameInput, name)
    expect(nameInput.props.value).toBe(name)
    expect(submitButton).toBeDisabled()

    const roomNumberInput = getByTestId(roomNumberInputLabel)
    await user.type(roomNumberInput, roomNumber)
    expect(roomNumberInput.props.value).toBe(roomNumber)
    expect(submitButton).toBeDisabled()

    const phoneButton = getByText(phoneInputLabel)
    await user.press(phoneButton)
    expect(submitButton).toBeDisabled()

    const phoneInput = getByTestId(phoneInputLabel)
    await user.type(phoneInput, phoneNumber)
    expect(phoneInput.props.value).toBe(phoneNumber)
    expect(submitButton).toBeEnabled()

    const messageInput = getByTestId(messageInputLabel)
    await user.type(messageInput, message)
    expect(messageInput.props.value).toBe(message)
    await waitFor(() => {
      expect(submitButton).toBeEnabled()
    })

    await user.press(submitButton)
    expect(mockedSubmitMalteHelpForm).toHaveBeenCalledWith(
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

    expect(mockShowSnackbar).toHaveBeenCalledWith({ text: 'submitSuccessful' })
  })

  it('should submit the form successfully with a request for contact in person', async () => {
    const { getByText, getByTestId } = renderWithTheme(<MalteHelpFormOffer {...props} />)

    const submitButton = getByText(submitButtonLabel)
    expect(submitButton).toBeDisabled()

    const nameInput = getByTestId(nameInputLabel)
    await user.type(nameInput, name)
    expect(nameInput.props.value).toBe(name)
    expect(submitButton).toBeDisabled()

    const roomNumberInput = getByTestId(roomNumberInputLabel)
    await user.type(roomNumberInput, roomNumber)
    expect(roomNumberInput.props.value).toBe(roomNumber)
    expect(submitButton).toBeDisabled()

    const personalContactButton = getByText(personalContactLabel)
    await user.press(personalContactButton)
    expect(submitButton).toBeDisabled()

    const messageInput = getByTestId(messageInputLabel)
    await user.type(messageInput, message)
    expect(messageInput.props.value).toBe(message)
    await waitFor(() => {
      expect(submitButton).toBeEnabled()
    })

    await user.press(submitButton)
    expect(mockedSubmitMalteHelpForm).toHaveBeenCalledWith(
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

    expect(mockShowSnackbar).toHaveBeenCalledWith({ text: 'submitSuccessful' })
  })

  it('should submit the form successfully with a request to be contacted by a woman', async () => {
    const { getByText, getByTestId } = renderWithTheme(<MalteHelpFormOffer {...props} />)

    const submitButton = getByText(submitButtonLabel)
    expect(submitButton).toBeDisabled()

    const nameInput = getByTestId(nameInputLabel)
    await user.type(nameInput, name)
    expect(nameInput.props.value).toBe(name)
    expect(submitButton).toBeDisabled()

    const roomNumberInput = getByTestId(roomNumberInputLabel)
    await user.type(roomNumberInput, roomNumber)
    expect(roomNumberInput.props.value).toBe(roomNumber)
    expect(submitButton).toBeDisabled()

    const personalContactButton = getByText(personalContactLabel)
    await user.press(personalContactButton)
    expect(submitButton).toBeDisabled()

    const femaleContactButton = getByText(femaleContactLabel)
    await user.press(femaleContactButton)
    expect(submitButton).toBeDisabled()

    const messageInput = getByTestId(messageInputLabel)
    await user.type(messageInput, message)
    expect(messageInput.props.value).toBe(message)
    await waitFor(() => {
      expect(submitButton).toBeEnabled()
    })

    await user.press(submitButton)
    expect(mockedSubmitMalteHelpForm).toHaveBeenCalledWith(
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

    expect(mockShowSnackbar).toHaveBeenCalledWith({ text: 'submitSuccessful' })
  })

  it('should submit the form successfully with a request to be contacted by a man', async () => {
    const { getByText, getByTestId } = renderWithTheme(<MalteHelpFormOffer {...props} />)

    const submitButton = getByText(submitButtonLabel)
    expect(submitButton).toBeDisabled()

    const nameInput = getByTestId(nameInputLabel)
    await user.type(nameInput, name)
    expect(nameInput.props.value).toBe(name)
    expect(submitButton).toBeDisabled()

    const roomNumberInput = getByTestId(roomNumberInputLabel)
    await user.type(roomNumberInput, roomNumber)
    expect(roomNumberInput.props.value).toBe(roomNumber)
    expect(submitButton).toBeDisabled()

    const personalContactButton = getByText(personalContactLabel)
    await user.press(personalContactButton)
    expect(submitButton).toBeDisabled()

    const maleContactButton = getByText(maleContactLabel)
    await user.press(maleContactButton)
    expect(submitButton).toBeDisabled()

    const messageInput = getByTestId(messageInputLabel)
    await user.type(messageInput, message)
    expect(messageInput.props.value).toBe(message)
    await waitFor(() => {
      expect(submitButton).toBeEnabled()
    })

    await user.press(submitButton)
    expect(mockedSubmitMalteHelpForm).toHaveBeenCalledWith(
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

    expect(mockShowSnackbar).toHaveBeenCalledWith({ text: 'submitSuccessful' })
  })

  it('should not submit if the name is empty', async () => {
    const { getByText, getByTestId } = renderWithTheme(<MalteHelpFormOffer {...props} />)

    const submitButton = getByText(submitButtonLabel)
    expect(submitButton).toBeDisabled()

    const roomNumberInput = getByTestId(roomNumberInputLabel)
    await user.type(roomNumberInput, roomNumber)
    expect(roomNumberInput.props.value).toBe(roomNumber)
    expect(submitButton).toBeDisabled()

    const emailInput = getByTestId(emailInputLabel)
    await user.type(emailInput, email)
    expect(emailInput.props.value).toBe(email)
    expect(submitButton).toBeDisabled()

    const messageInput = getByTestId(messageInputLabel)
    await user.type(messageInput, message)
    expect(messageInput.props.value).toBe(message)
    expect(submitButton).toBeDisabled()

    await user.press(submitButton)
    expect(mockedSubmitMalteHelpForm).not.toHaveBeenCalled()

    expect(mockShowSnackbar).not.toHaveBeenCalled()
  })

  it('should not submit if Zammad says the email address is invalid', async () => {
    mockedSubmitMalteHelpForm.mockImplementation(() => {
      throw new InvalidEmailError()
    })

    const { getByText, getByTestId } = renderWithTheme(<MalteHelpFormOffer {...props} />)

    const submitButton = getByText(submitButtonLabel)
    expect(submitButton).toBeDisabled()

    const nameInput = getByTestId(nameInputLabel)
    await user.type(nameInput, name)
    expect(nameInput.props.value).toBe(name)
    expect(submitButton).toBeDisabled()

    const roomNumberInput = getByTestId(roomNumberInputLabel)
    await user.type(roomNumberInput, roomNumber)
    expect(roomNumberInput.props.value).toBe(roomNumber)
    expect(submitButton).toBeDisabled()

    const emailInput = getByTestId(emailInputLabel)
    await user.type(emailInput, 'email')
    expect(emailInput.props.value).toBe('email')
    expect(submitButton).toBeEnabled()

    const messageInput = getByTestId(messageInputLabel)
    await user.type(messageInput, message)
    expect(messageInput.props.value).toBe(message)
    expect(submitButton).toBeEnabled()

    await user.press(submitButton)
    expect(mockedSubmitMalteHelpForm).toHaveBeenCalledWith(
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

    expect(mockShowSnackbar).toHaveBeenCalledWith({ text: 'invalidEmailAddress' })
  })

  it('should show an error if there is another error while sending to Zammad', async () => {
    mockedSubmitMalteHelpForm.mockImplementation(() => {
      throw new Error()
    })

    const { getByText, getByTestId } = renderWithTheme(<MalteHelpFormOffer {...props} />)

    const submitButton = getByText(submitButtonLabel)
    expect(submitButton).toBeDisabled()

    const nameInput = getByTestId(nameInputLabel)
    await user.type(nameInput, name)
    expect(nameInput.props.value).toBe(name)
    expect(submitButton).toBeDisabled()

    const roomNumberInput = getByTestId(roomNumberInputLabel)
    await user.type(roomNumberInput, roomNumber)
    expect(roomNumberInput.props.value).toBe(roomNumber)
    expect(submitButton).toBeDisabled()

    const emailInput = getByTestId(emailInputLabel)
    await user.type(emailInput, email)
    expect(emailInput.props.value).toBe(email)
    expect(submitButton).toBeEnabled()

    const messageInput = getByTestId(messageInputLabel)
    await user.type(messageInput, message)
    expect(messageInput.props.value).toBe(message)
    expect(submitButton).toBeEnabled()

    await user.press(submitButton)
    expect(mockedSubmitMalteHelpForm).toHaveBeenCalledWith(
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

    expect(mockShowSnackbar).toHaveBeenCalledWith({ text: 'error:unknownError' })
  })
})
