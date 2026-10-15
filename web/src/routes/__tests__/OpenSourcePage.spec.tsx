import React from 'react'

import { useLoadAsync } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import OpenSourcePage from '../OpenSourcePage'

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadAsync: jest.fn(),
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

describe('OpenSourcePage', () => {
  beforeEach(jest.clearAllMocks)

  it('should render github and sbom reference section', () => {
    mockUseLoadAsync([])
    const { getByText } = renderWithRouterAndTheme(<OpenSourcePage languageCode='de' />)
    expect(getByText(/about:openSources.sourceCode/)).toBeDefined()
    expect(getByText(/about:openSources.sbom/)).toBeDefined()
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
    const { getByText, getAllByText } = renderWithRouterAndTheme(<OpenSourcePage languageCode='de' />)
    expect(getAllByText('about:openSources.title')).toHaveLength(2)
    expect(getByText('react')).toBeTruthy()
    expect(getByText('lodash')).toBeTruthy()
  })
})
