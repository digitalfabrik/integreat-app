import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import navigateToLink from '../../navigation/navigateToLink'
import CategoryListContent from '../CategoryListContent'
import NativeHtml from '../NativeHtml'

const mockNavigation = jest.fn()

jest.mock('../../navigation/navigateToLink', () => jest.fn(Promise.resolve))
jest.mock('../../hooks/useSnackbar')
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(() => ({ width: 1234 }))
}))
jest.mock('react-redux', () => ({
  useDispatch: jest.fn()
}))
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation
}))
jest.mock('styled-components')

describe('NativeHtml', () => {
  const dictUrl = 'https://my.cust/om/dict/url'
  const url1 = 'https://so.me/url/thingy'
  const url2 = 'https://so.meoth.er/clicking/thingy'
  const cacheDictionary = {
    [url2]: dictUrl
  }
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should display the content correctly', () => {
    const content1 = 'This is some nice, I mean'
    const content2 = 'really nice html content'
    const content3 = '<a href="https://so.me/url/thingy">Click me!</a> with a link'
    const htmlContent = `<div><p dir='rtl'>${content1}</p><p>${content2}</p><p>${content3}</p></div>`
    const { getByText } = render(<NativeHtml content={htmlContent} cacheDictionary={cacheDictionary} language='de' />)
    expect(getByText(content1)).toBeTruthy()
    expect(getByText(content2)).toBeTruthy()
    expect(getByText('Click me!')).toBeTruthy()
    expect(getByText('with a link')).toBeTruthy()
    expect(() => getByText('href=')).toThrow()
  })

  it('should display arabic content correctly', () => {
    const content1 = 'سواء إذا كنت قد وصلت هنا للتو أو كنت تعيش هنا بالفعل منذ فترة أطول'
    const content2 = 'والأمر'
    const htmlContent = `<div><p dir='rtl'>${content1}</p><p>${content2}</p></div>`
    const { getByText } = render(
      <CategoryListContent content={htmlContent} cacheDictionary={cacheDictionary} language='ar' />
    )
    expect(getByText(content1)).toBeTruthy()
    expect(getByText(content2)).toBeTruthy()
  })

  it('should replace links correctly', () => {
    const text1 = 'Click me!'
    const text2 = 'Give me a hug!'
    const content1 = `<a href='${url1}'>${text1}</a>`
    const content2 = `<a href='${url2}'>${text2}</a>`
    const htmlContent = `<div><p dir='rtl'>${content1}</p><p>${content2}</p></div>`
    const { getByText } = render(
      <CategoryListContent content={htmlContent} cacheDictionary={cacheDictionary} language='de' />
    )
    fireEvent.press(getByText(text1))
    expect(navigateToLink).toHaveBeenNthCalledWith(1, url1, mockNavigation, 'de', expect.anything(), url1)
    fireEvent.press(getByText(text2))
    expect(navigateToLink).toHaveBeenNthCalledWith(2, dictUrl, mockNavigation, 'de', expect.anything(), url2)
  })

  it('should not replace links', () => {
    const text1 = 'Click me!'
    const content1 = `<a href='${url1}'>${text1}</a>`
    const htmlContent = `<div><p dir='rtl'>${content1}</p></div>`
    const { getByText } = render(<NativeHtml content={htmlContent} language='de' />)
    fireEvent.press(getByText(text1))
    expect(navigateToLink).toHaveBeenCalledTimes(1)
    expect(navigateToLink).toHaveBeenCalledWith(url1, mockNavigation, 'de', expect.anything(), url1)
  })
})
