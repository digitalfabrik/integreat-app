import { renderHook, waitFor } from '@testing-library/react'
import { DateTime } from 'luxon'

import ExtendedPageModel from '../../api/models/ExtendedPageModel'
import useSearch from '../useSearch'

describe('useSearch', () => {
  const documents = [
    new ExtendedPageModel({
      path: '/testumgebung/de/arbeit',
      title: 'Arbeit',
      content: 'Arbeit',
      lastUpdate: DateTime.now(),
      thumbnail: null,
      availableLanguages: { en: '/testumgebung/en/work' },
    }),
    new ExtendedPageModel({
      path: '/testumgebung/de/willkommen',
      title: 'Willkommen',
      content: 'Willkommen in der Testumgebung',
      lastUpdate: DateTime.now(),
      thumbnail: null,
      availableLanguages: { en: '/testumgebung/en/welcome' },
    }),
    new ExtendedPageModel({
      path: '/testumgebung/de/willkommen/willkommen-in-deutschland',
      title: 'Willkommen in Deutschland',
      content: 'Mein Text über Deutschland',
      lastUpdate: DateTime.now(),
      thumbnail: null,
      availableLanguages: { en: '/testumgebung/en/welcome/welcome-to-germany' },
    }),
    new ExtendedPageModel({
      path: '/testumgebung/de/willkommen/arrival',
      title: 'Ankommen',
      content: 'Herzlich Willkommen!',
      lastUpdate: DateTime.now(),
      thumbnail: null,
      availableLanguages: { en: '/testumgebung/en/welcome/welcome-to-germany' },
    }),
    new ExtendedPageModel({
      path: '/testumgebung/de/bildung/grundschule',
      title: 'Grundschule',
      content: 'Grundschule',
      lastUpdate: DateTime.now(),
      thumbnail: null,
      availableLanguages: { en: '/testumgebung/en/education/primary-school' },
    }),
  ]

  it('should return results matched by both title and content', async () => {
    const { result } = renderHook(() => useSearch(documents, 'Willkommen'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    const { data } = result.current
    expect(data).toEqual([documents[1], documents[2], documents[3]])
  })

  it('should only return search results that match all search terms', async () => {
    const { result } = renderHook(() => useSearch(documents, 'Willkommen in Deutschland'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    const { data } = result.current
    expect(data).toEqual([documents[2]])
  })

  it('should correctly handle documents with duplicated paths', async () => {
    const { result } = renderHook(() => useSearch(documents.concat(documents), 'Willkommen in Deutschland'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    const { data, error } = result.current
    expect(data).toEqual([documents[2]])
    expect(error).toBeNull()
  })
})
