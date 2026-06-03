import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { useLoadAsync } from 'shared/api'

import render from '../../testing/render'
import Licenses from '../Licenses'

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadAsync: jest.fn(),
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

jest.mock('../../hooks/useSnackbar', () => ({ __esModule: true, default: () => jest.fn() }))
jest.mock('../../utils/openExternalUrl', () => ({ __esModule: true, default: jest.fn() }))

const { mocked } = jest

const mockUseLoadAsync = (data: unknown) =>
  mocked(useLoadAsync).mockReturnValue({
    data,
    error: null,
    loading: false,
    refresh: jest.fn(),
    setData: jest.fn(),
  } as never)

describe('Licenses', () => {
  beforeEach(jest.clearAllMocks)

  it('should render the page title', () => {
    mockUseLoadAsync([])
    const { getByText } = render(<Licenses />)
    expect(getByText('openSourceLicenses')).toBeTruthy()
  })

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
    const { getByText } = render(<Licenses />)
    expect(getByText('react')).toBeTruthy()
    expect(getByText('lodash')).toBeTruthy()
  })

  it('should open repository url when pressing a license item with a repository', () => {
    const openExternalUrl = jest.mocked(require('../../utils/openExternalUrl').default)
    mockUseLoadAsync([
      {
        name: 'react',
        version: '18.2.0',
        license: 'MIT',
        repository: 'https://github.com/facebook/react',
        author: 'Meta',
      },
    ])
    const { getAllByRole } = render(<Licenses />)
    fireEvent.press(getAllByRole('link')[0]!)
    expect(openExternalUrl).toHaveBeenCalledWith('https://github.com/facebook/react', expect.any(Function))
  })

  it('should not open url when repository is not provided', () => {
    const openExternalUrl = jest.mocked(require('../../utils/openExternalUrl').default)
    mockUseLoadAsync([{ name: 'some-lib', version: '1.0.0', license: 'MIT', repository: undefined, author: undefined }])
    const { getAllByRole } = render(<Licenses />)
    fireEvent.press(getAllByRole('link')[0]!)
    expect(openExternalUrl).not.toHaveBeenCalled()
  })
})
