import { DateTime } from 'luxon'

import { MAX_DAYS_NEW } from '../../../constants/index.ts'
import DocumentModel from '../DocumentModel.ts'

describe('DocumentModel', () => {
  const page = new DocumentModel({
    id: 1,
    path: '/augsburg/fa/erste-schritte/%D9%86%D9%82%D8%B4%D9%87-%D8%B4%D9%87%D8%B1/',
    title: 'Welcome',
    content: '',
    lastUpdate: DateTime.fromISO('2016-01-07 10:36:24'),
    publishedAt: DateTime.fromISO('2016-01-07 10:36:24'),
  })

  it('should normalize path', () => {
    expect(page.path).toBe('/augsburg/fa/erste-schritte/نقشه-شهر')
  })

  describe('isNew', () => {
    const createDocument = (publishedAt: DateTime) =>
      new DocumentModel({
        id: 1,
        path: '/augsburg/de/imprint',
        title: 'Imprint',
        content: '',
        lastUpdate: publishedAt,
        publishedAt,
      })

    it('should be new if published less than MAX_DAYS_NEW days ago', () => {
      expect(createDocument(DateTime.now().minus({ days: MAX_DAYS_NEW - 1 })).isNew).toBe(true)
    })

    it('should not be new if published MAX_DAYS_NEW or more days ago', () => {
      expect(createDocument(DateTime.now().minus({ days: MAX_DAYS_NEW })).isNew).toBe(false)
      expect(createDocument(DateTime.now().minus({ days: MAX_DAYS_NEW + 1 })).isNew).toBe(false)
    })

    it('should not be new if the publishing date is invalid', () => {
      expect(createDocument(DateTime.fromISO('')).isNew).toBe(false)
    })
  })
})
