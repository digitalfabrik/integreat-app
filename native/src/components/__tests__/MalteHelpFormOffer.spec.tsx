import { act, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Control, useForm } from 'react-hook-form'
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'

import { OfferModel, submitMalteHelpForm } from 'shared/api'

import renderWithTheme from '../../testing/render'
import MalteHelpFormOffer from '../MalteHelpFormOffer'

jest.mock('react-i18next')
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  submitMalteHelpForm: jest.fn(),
}))
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext)
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: () => ({
    // ...useForm,
    handleSubmit: (fn: () => void) => fn(),
    // formState: {
    //   isValid: true,
    //   isSubmitting: false,
    //   control: () => ({}) as Control,
    // },
  }),
}))

const submitButtonLabel = 'submit'
const nameInputLabel = 'name'
const name = 'Doe, Jane'
const roomNumberInputLabel = 'roomNumber'
const roomNumber = '42'
const emailInputLabel = 'eMail'
const email = 'testEmail@tuerantuer.org'
const phoneInputLabel = 'telephone'
const phoneNumber = '0049 160 12345678'
const personalContactLabel = 'personally'
const femaleContactLabel = 'contactPersonGenderFemale'
const maleContactLabel = 'contactPersonGenderMale'
const messageInputLabel = 'contactReason'
const message =
  "Hello, I can't figure out how to open my window for my contractually agreed daily Lüften, can you help me?"

describe('MalteHelpFormOffer', () => {
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
    categoryPageTitle: 'Kontaktformular',
    cityCode: 'testumgebung',
    malteHelpFormOffer: offer,
    url: '',
    onSubmit: () => undefined,
  }

  it.only('should submit the form successfully with an email', async () => {
    const { debug, getByText } = renderWithTheme(<MalteHelpFormOffer {...props} />)

    const submitButton = getByText(submitButtonLabel)
    // expect(submitButton).toBeDisabled()

    const nameInput = getByText(nameInputLabel)
    // fireEvent.press(nameInput)
    await act(async () => fireEvent.press(nameInput))
    fireEvent.changeText(nameInput, name)
    // expect(submitButton).toBeDisabled()

    // const roomNumberInput = getByText(roomNumberInputLabel)
    // fireEvent.press(roomNumberInput)
    // fireEvent.changeText(roomNumberInput, roomNumber)
    // // expect(submitButton).toBeDisabled()

    // const emailInput = getByText(emailInputLabel)
    // fireEvent.press(emailInput)
    // fireEvent.changeText(emailInput, email)
    // // expect(submitButton).toBeEnabled()

    // const messageInput = getByText(messageInputLabel)
    // fireEvent.press(messageInput)
    // fireEvent.changeText(messageInput, message)
    // // expect(submitButton).toBeEnabled()

    await act(async () => fireEvent.press(submitButton))
    await expect(submitMalteHelpForm).toHaveBeenCalled()
    // expect(submitMalteHelpForm).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     comment: message,
    //     contactChannel: 'email',
    //     contactGender: 'any',
    //     email,
    //     name,
    //     roomNumber,
    //     telephone: '',
    //   }),
    // )
  })

  it('should submit the form successfully with a phone number', () => {})
  it('should submit the form successfully with a request for contact in person', () => {})
  it('should submit the form successfully with a request to be contacted by a woman', () => {})
  it('should submit the form successfully with a request to be contacted by a man', () => {})
  it('should not submit if the name is empty', () => {})
  it('should not submit if Zammad says the email address is invalid', () => {})
})
