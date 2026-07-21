import { parseLicenses } from '../licences.ts'

describe('parseLicenses', () => {
  it('should return empty array for empty input', () => {
    expect(parseLicenses({})).toEqual([])
  })

  it('should parse name, version, license, repository and author', () => {
    expect(
      parseLicenses({
        'react@18.2.0': { license: 'MIT', repository: 'https://github.com/facebook/react', author: 'Meta' },
      }),
    ).toEqual([
      {
        name: 'react',
        version: '18.2.0',
        license: 'MIT',
        repository: 'https://github.com/facebook/react',
        author: 'Meta',
      },
    ])
  })

  it('should handle missing optional fields', () => {
    expect(parseLicenses({ 'some-lib@1.0.0': { license: 'Apache-2.0' } })).toEqual([
      { name: 'some-lib', version: '1.0.0', license: 'Apache-2.0', repository: undefined, author: undefined },
    ])
  })

  it('should handle scoped packages', () => {
    expect(parseLicenses({ '@emotion/react@11.10.5': { license: 'MIT' } })).toEqual([
      { name: '@emotion/react', version: '11.10.5', license: 'MIT', repository: undefined, author: undefined },
    ])
  })

  it('should parse multiple licenses', () => {
    const result = parseLicenses({
      'react@18.2.0': { license: 'MIT' },
      'lodash@4.17.21': { license: 'MIT' },
    })
    expect(result).toHaveLength(2)
    expect(result.map(l => l.name)).toEqual(['react', 'lodash'])
  })
})
