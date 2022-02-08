import moment from 'moment'

import PageModel from '../PageModel'

describe('PageModel', () => {
  const page = new PageModel({
    path: '/augsburg/fa/erste-schritte/%D9%86%D9%82%D8%B4%D9%87-%D8%B4%D9%87%D8%B1/',
    title: 'Welcome',
    content: '',
    lastUpdate: moment('2016-01-07 10:36:24'),
    hash: '91d435afbc7aa83496137e81fd2832e3'
  })

  it('should normalize path', () => {
    expect(page.path).toBe('/augsburg/fa/erste-schritte/نقشه-شهر')
  })
})
