import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { useLoadAsync } from 'shared/api'

import render from '../../testing/render'
import OpenSource from '../OpenSource'

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadAsync: jest.fn(),
}))

jest.mock('../../hooks/useSnackbar', () => ({ __esModule: true, default: () => jest.fn() }))
const mockOpenExternalUrl = jest.fn()
jest.mock('../../utils/openExternalUrl', () => ({ __esModule: true, default: () => mockOpenExternalUrl }))

const { mocked } = jest

const mockUseLoadAsync = (data: unknown) =>
  mocked(useLoadAsync).mockReturnValue({
    data,
    error: null,
    loading: false,
    refresh: jest.fn(),
    setData: jest.fn(),
  } as never)

describe('OpenSource', () => {
  beforeEach(jest.clearAllMocks)

  it('should render the page title', () => {
    mockUseLoadAsync([])
    const { getByText } = render(<OpenSource />)
    expect(getByText('about:openSource.title')).toBeTruthy()
  })

  it('should render github and sbom reference section', () => {
    mockUseLoadAsync([])
    const { getByText } = render(<OpenSource />)
    expect(getByText('about:openSource.sourceCode Integreat')).toBeTruthy()
    expect(getByText('about:openSource.sbom')).toBeTruthy()
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
    const { getByText } = render(<OpenSource />)
    expect(getByText('react')).toBeTruthy()
    expect(getByText('lodash')).toBeTruthy()
  })

  it('should open repository url when pressing a license item with a repository', () => {
    mockUseLoadAsync([
      {
        name: 'react',
        version: '18.2.0',
        license: 'MIT',
        repository: 'https://github.com/facebook/react',
        author: 'Meta',
      },
    ])
    const { getAllByRole } = render(<OpenSource />)
    fireEvent.press(getAllByRole('link')[0]!)
    expect(mockOpenExternalUrl).toHaveBeenCalledWith('https://github.com/facebook/react')
  })

  it('should not open url when repository is not provided', () => {
    mockUseLoadAsync([{ name: 'some-lib', version: '1.0.0', license: 'MIT', repository: undefined, author: undefined }])
    const { getAllByRole } = render(<OpenSource />)
    fireEvent.press(getAllByRole('link')[0]!)
    expect(mockOpenExternalUrl).not.toHaveBeenCalled()
  })
})
