import React from 'react'

import { useLoadAsync } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import LicensesPage from '../LicensesPage'

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadAsync: jest.fn(),
}))

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({ t: (key: string) => key }),
}))

const { mocked } = jest

const mockUseLoadAsync = (data: unknown) =>
  mocked(useLoadAsync).mockReturnValue({
    data,
    error: null,
    loading: false,
    refresh: jest.fn(),
    setData: jest.fn(),
  } as never)

describe('LicensesPage', () => {
  beforeEach(jest.clearAllMocks)

  it('should render license items', () => {
    mockUseLoadAsync([
      {
        name: 'react',
        version: '18.2.0',
        license: 'MIT',
        repository: 'https://github.com/facebook/react',
        author: 'Meta',
      },
      { name: 'lodash', version: '4.17.21', license: 'MIT', repository: undefined, author: undefined },
    ])
    const { getByText, getAllByText } = renderWithRouterAndTheme(<LicensesPage languageCode='de' />)
    expect(getAllByText('settings:openSourceLicenses')).toHaveLength(2)
    expect(getByText('react')).toBeTruthy()
    expect(getByText('lodash')).toBeTruthy()
  })

  it('should show empty message when no licenses are loaded', () => {
    mockUseLoadAsync([])
    const { getByRole } = renderWithRouterAndTheme(<LicensesPage languageCode='de' />)
    expect(getByRole('alert')).toHaveTextContent('licenses:noLicensesMessage')
  })
})
