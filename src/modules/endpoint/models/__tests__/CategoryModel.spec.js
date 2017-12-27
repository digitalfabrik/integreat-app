import CategoryModel from '../CategoryModel'

describe('CategoryModel', () => {
  test('should return correct attributes', () => {
    const props = {
      id: 1,
      url: '/test/url',
      parentId: 40,
      content: 'test content blablabla',
      thumbnail: '/test/url/thumbnail',
      order: 5,
      availableLanguages: {en: 5, de: 74}}
    const category = new CategoryModel(props)
    expect(category.id).toBe(props.id)
    expect(category.url).toBe(props.url)
    expect(category.parentId).toBe(props.parentId)
    expect(category.content).toBe(props.content)
    expect(category.thumbnail).toBe(props.thumbnail)
    expect(category.order).toBe(props.order)
    expect(category.availableLanguages).toBe(props.availableLanguages)
  })

  test('should have correct default attributes', () => {
    const category = new CategoryModel({id: 4, url: '/test/url'})
    expect(category.parentId).toBe(-1)
    expect(category.parentUrl).toBe(null)
    expect(category.content).toBe('')
    expect(category.thumbnail).toBe(null)
    expect(category.order).toBe(0)
    expect(category.availableLanguages).toEqual({})
  })
})
