import { expect } from 'chai'
import Hierarchy from 'routes/LocationPage/Hierarchy'
import PageModel from '../src/endpoints/models/PageModel'
import { describe, it } from 'mocha'

describe('hierarchy', () => {
  const hierarchy = new Hierarchy('/123/456')

  const child2 = new PageModel(456, '456', 'Another Simple Page', 0)
  const child1 = new PageModel(123, '123', 'Simple Page', 0, 'Content', null, {456: child2})
  const root = new PageModel(0, '0', 'Augsburg', 0, 'Content', null, {123: child1})

  hierarchy.build(root)

  it('should build', () => {

    const pages = hierarchy.pages

    expect(pages[0]).to.deep.equal(root, 'The root page should be the first page')
    expect(pages[1]).to.deep.equal(child1, 'The child1 page does not equal')
    expect(pages[2]).to.deep.equal(child2, 'The child2 page does not equal')
  })

  it('should map paths', () => {
    let paths = []

    hierarchy.map((page, path) => {
      paths.push(path)
    })

    expect(paths).to.deep.equal(['', '/123', '/123/456'])
  })
})
