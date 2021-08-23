import React from 'react'
import CategoryListContent from '../CategoryListContent'
import buildConfig from '../../constants/buildConfig'
import { fireEvent, render } from '@testing-library/react-native'
import NativeHtml from '../NativeHtml'

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(() => ({ width: 1234 }))
}))

describe('NativeHtml', () => {
  const navigateToLink = jest.fn()
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
    const { getByText } = render(
      <NativeHtml
        content={htmlContent}
        navigateToLink={navigateToLink}
        cacheDictionary={cacheDictionary}
        language='de'
        theme={buildConfig().lightTheme}
      />
    )
    expect(getByText(content1)).toBeTruthy()
    expect(getByText(content2)).toBeTruthy()
    expect(getByText('Click me!')).toBeTruthy()
    expect(getByText(' with a link')).toBeTruthy()
    expect(() => getByText('href=')).toThrow()
  })

  it('should display arabic content correctly', () => {
    const content1 = 'سواء إذا كنت قد وصلت هنا للتو أو كنت تعيش هنا بالفعل منذ فترة أطول'
    const content2 = 'والأمر'
    const htmlContent = `<div><p dir='rtl'>${content1}</p><p>${content2}</p></div>`
    const { getByText } = render(
      <CategoryListContent
        content={htmlContent}
        navigateToLink={navigateToLink}
        cacheDictionary={cacheDictionary}
        language='ar'
        theme={buildConfig().lightTheme}
      />
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
      <CategoryListContent
        content={htmlContent}
        navigateToLink={navigateToLink}
        cacheDictionary={cacheDictionary}
        language='de'
        theme={buildConfig().lightTheme}
      />
    )
    fireEvent.press(getByText(text1))
    expect(navigateToLink).toHaveBeenCalledTimes(1)
    expect(navigateToLink).toHaveBeenCalledWith(url1, 'de', url1)
    fireEvent.press(getByText(text2))
    expect(navigateToLink).toHaveBeenCalledTimes(2)
    expect(navigateToLink).toHaveBeenCalledWith(dictUrl, 'de', url2)
  })

  it('should not replace links', () => {
    const text1 = 'Click me!'
    const content1 = `<a href='${url1}'>${text1}</a>`
    const htmlContent = `<div><p dir='rtl'>${content1}</p></div>`
    const { getByText } = render(
      <NativeHtml
        content={htmlContent}
        navigateToLink={navigateToLink}
        language='de'
        theme={buildConfig().lightTheme}
      />
    )
    fireEvent.press(getByText(text1))
    expect(navigateToLink).toHaveBeenCalledTimes(1)
    expect(navigateToLink).toHaveBeenCalledWith(url1, 'de', url1)
  })
})
