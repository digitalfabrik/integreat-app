import Hierarchy from 'routes/LocationPage/Hierarchy'
import PageModel from 'endpoints/models/PageModel'

describe('Hierarchy', () => {
  const hierarchy = new Hierarchy('/123/456')

  const child2 = new PageModel({numericId: 456, id: '456', title: 'Another Simple Page', parent: 0})
  const child1 = new PageModel({
    numericId: 123,
    id: '123',
    title: 'Simple Page',
    parent: 0,
    content: 'Content',
    children: [child2]
  })
  const root = new PageModel({
    numericId: 0,
    id: '0',
    title: 'Augsburg',
    parent: 0,
    content: 'Content',
    children: [child1]
  })

  hierarchy.build(root)

  test('should build', () => {
    const pages = hierarchy.pages

    expect(pages[0]).toEqual(root, 'The root page should be the first page')
    expect(pages[1]).toEqual(child1, 'The child1 page does not equal')
    expect(pages[2]).toEqual(child2, 'The child2 page does not equal')
  })

  test('should map paths', () => {
    let paths = []

    hierarchy.map((page, path) => {
      paths.push(path)
    })

    expect(paths).toEqual(['', '/123', '/123/456'])
  })
})
