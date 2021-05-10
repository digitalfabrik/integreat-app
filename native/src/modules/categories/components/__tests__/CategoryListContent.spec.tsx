import React from 'react'
import CategoryListContent from '../CategoryListContent'
import { lightTheme } from 'build-configs/integreat/theme'
import { render, fireEvent } from '@testing-library/react-native'
import moment from 'moment'
import type Moment from 'moment'
jest.mock('../../../common/components/TimeStamp', () => ({ lastUpdate }: { lastUpdate: Moment }) => {
  const Text = require('react-native').Text

  return <Text>lastUpdate {lastUpdate.toISOString()}</Text>
})
describe('CategoryListContent', () => {
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
    const htmlContent = `<div><p dir="rtl">${content1}</p><p>${content2}</p><p>${content3}</p></div>`
    const { getByText } = render(
      <CategoryListContent
        content={htmlContent}
        navigateToLink={navigateToLink}
        cacheDictionary={cacheDictionary}
        language='de'
        theme={lightTheme}
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
    const htmlContent = `<div><p dir="rtl">${content1}</p><p>${content2}</p></div>`
    const { getByText } = render(
      <CategoryListContent
        content={htmlContent}
        navigateToLink={navigateToLink}
        cacheDictionary={cacheDictionary}
        language='ar'
        theme={lightTheme}
      />
    )
    expect(getByText(content1)).toBeTruthy()
    expect(getByText(content2)).toBeTruthy()
  })
  it('should handle link clicks correctly', () => {
    const text1 = 'Click me!'
    const text2 = 'Give me a hug!'
    const content1 = `<a href="${url1}">${text1}</a>`
    const content2 = `<a href="${url2}">${text2}</a>`
    const htmlContent = `<div><p dir="rtl">${content1}</p><p>${content2}</p></div>`
    const { getByText } = render(
      <CategoryListContent
        content={htmlContent}
        navigateToLink={navigateToLink}
        cacheDictionary={cacheDictionary}
        language='de'
        theme={lightTheme}
      />
    )
    fireEvent.press(getByText(text1))
    expect(navigateToLink).toHaveBeenCalledTimes(1)
    expect(navigateToLink).toHaveBeenCalledWith(url1, 'de', url1)
    fireEvent.press(getByText(text2))
    expect(navigateToLink).toHaveBeenCalledTimes(2)
    expect(navigateToLink).toHaveBeenCalledWith(dictUrl, 'de', url2)
  })
  it('should display the last update timestamp correctly', () => {
    const content1 = 'This is some easy content'
    const iso = '2011-05-04T00:00:00.000Z'
    const lastUpdate = moment(iso)
    const { getByText } = render(
      <CategoryListContent
        content={content1}
        navigateToLink={navigateToLink}
        cacheDictionary={cacheDictionary}
        language='de'
        lastUpdate={lastUpdate}
        theme={lightTheme}
      />
    )
    expect(getByText(`lastUpdate ${iso}`)).toBeTruthy()
  })
})
