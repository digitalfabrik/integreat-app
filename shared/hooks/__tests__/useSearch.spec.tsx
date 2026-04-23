import { renderHook, waitFor } from '@testing-library/react'
import { DateTime } from 'luxon'

import ExtendedDocumentModel from '../../api/models/ExtendedDocumentModel'
import useMultiLanguageSearch, { useSearch } from '../useSearch'

describe('useSearch', () => {
  const documents = [
    new ExtendedDocumentModel({
      path: '/testumgebung/de/arbeit',
      title: 'Arbeit',
      content: 'Arbeit',
      lastUpdate: DateTime.now(),
      thumbnail: null,
      availableLanguages: { en: '/testumgebung/en/work' },
    }),
    new ExtendedDocumentModel({
      path: '/testumgebung/de/willkommen',
      title: 'Willkommen',
      content: 'Willkommen in der Testumgebung',
      lastUpdate: DateTime.now(),
      thumbnail: null,
      availableLanguages: { en: '/testumgebung/en/welcome' },
    }),
    new ExtendedDocumentModel({
      path: '/testumgebung/de/willkommen/willkommen-in-deutschland',
      title: 'Willkommen in Deutschland',
      content: 'Mein Text über Deutschland',
      lastUpdate: DateTime.now(),
      thumbnail: null,
      availableLanguages: { en: '/testumgebung/en/welcome/welcome-to-germany' },
    }),
    new ExtendedDocumentModel({
      path: '/testumgebung/de/willkommen/arrival',
      title: 'Ankommen',
      content: 'Herzlich Willkommen!',
      lastUpdate: DateTime.now(),
      thumbnail: null,
      availableLanguages: { en: '/testumgebung/en/welcome/welcome-to-germany' },
    }),
    new ExtendedDocumentModel({
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
    expect(data.map(result => result.id)).toEqual([documents[1]!.path, documents[2]!.path, documents[3]!.path])
  })

  it('should only return search results that match all search terms', async () => {
    const { result } = renderHook(() => useSearch(documents, 'Willkommen in Deutschland'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    const { data } = result.current
    expect(data.map(result => result.id)).toEqual([documents[2]!.path])
  })

  it('should correctly handle documents with duplicated paths', async () => {
    const { result } = renderHook(() => useSearch(documents.concat(documents), 'Willkommen in Deutschland'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    const { data, error } = result.current
    expect(data.map(result => result.id)).toEqual([documents[2]!.path])
    expect(error).toBeNull()
  })

  it('should tolerate a slightly larger typo distance for Willkommen', async () => {
    const { result } = renderHook(() => useSearch(documents, 'Wellkomenn'))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data.map(result => result.id)).toEqual([
      documents[1]!.path,
      documents[2]!.path,
      documents[3]!.path,
    ])
  })

  it('should store availableLanguages in search results', async () => {
    const { result } = renderHook(() => useSearch(documents, 'Arbeit'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    const { data } = result.current
    expect(data).toHaveLength(1)
    expect(data[0]!.availableLanguages).toEqual({ en: '/testumgebung/en/work' })
  })
})

describe('useMultiLanguageSearch', () => {
  const userLanguageDocuments = [
    new ExtendedDocumentModel({
      path: '/testumgebung/en/work',
      title: 'Work',
      content: 'Work content',
      lastUpdate: DateTime.now(),
      thumbnail: null,
      availableLanguages: { de: '/testumgebung/de/arbeit' },
    }),
    new ExtendedDocumentModel({
      path: '/testumgebung/en/welcome',
      title: 'Welcome',
      content: 'Welcome to the test environment',
      lastUpdate: DateTime.now(),
      thumbnail: null,
      availableLanguages: { de: '/testumgebung/de/willkommen' },
    }),
    new ExtendedDocumentModel({
      path: '/testumgebung/en/education',
      title: 'Education',
      content: 'Education content',
      lastUpdate: DateTime.now(),
      thumbnail: null,
      availableLanguages: { de: '/testumgebung/de/bildung' },
    }),
  ]

  const sourceLanguageDocuments = [
    new ExtendedDocumentModel({
      path: '/testumgebung/de/arbeit',
      title: 'Arbeit',
      content: 'Arbeit Inhalt',
      lastUpdate: DateTime.now(),
      thumbnail: null,
      availableLanguages: { en: '/testumgebung/en/work' },
    }),
    new ExtendedDocumentModel({
      path: '/testumgebung/de/willkommen',
      title: 'Willkommen',
      content: 'Willkommen im Testumgebung',
      lastUpdate: DateTime.now(),
      thumbnail: null,
      availableLanguages: { en: '/testumgebung/en/welcome' },
    }),
    new ExtendedDocumentModel({
      path: '/testumgebung/de/nur-deutsch',
      title: 'Nur Deutsch',
      content: 'Nur auf Deutsch verfügbar',
      lastUpdate: DateTime.now(),
      thumbnail: null,
      availableLanguages: {},
    }),
  ]

  it('should return all user language documents when query is empty', async () => {
    const { result } = renderHook(() =>
      useMultiLanguageSearch({
        userLanguageDocuments,
        moreDocuments: sourceLanguageDocuments,
        query: '',
        userLanguageCode: 'en',
      }),
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual(userLanguageDocuments)
  })

  it('should return user language documents for user language matches', async () => {
    const { result } = renderHook(() =>
      useMultiLanguageSearch({
        userLanguageDocuments,
        moreDocuments: sourceLanguageDocuments,
        query: 'Welcome',
        userLanguageCode: 'en',
      }),
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual([userLanguageDocuments[1]])
  })

  it('should return the user language version when a source language document matches', async () => {
    const { result } = renderHook(() =>
      useMultiLanguageSearch({
        userLanguageDocuments,
        moreDocuments: sourceLanguageDocuments,
        query: 'Arbeit',
        userLanguageCode: 'en',
      }),
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    // Should return the English (user language) version of the German match
    expect(result.current.data).toEqual([userLanguageDocuments[0]])
  })

  it('should fall back to the source language document when no user language translation exists', async () => {
    const { result } = renderHook(() =>
      useMultiLanguageSearch({
        userLanguageDocuments,
        moreDocuments: sourceLanguageDocuments,
        query: 'Nur Deutsch',
        userLanguageCode: 'en',
      }),
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    // No English translation exists, so the German source document is returned
    expect(result.current.data).toEqual([sourceLanguageDocuments[2]])
  })

  it('should not return duplicates when content appears in both user language and source language results', async () => {
    // "work" matches both English "Work" doc and maps German "Arbeit" → English "Work"
    const overlappingUserDocs = [
      new ExtendedDocumentModel({
        path: '/testumgebung/en/work',
        title: 'Work',
        content: 'Work content',
        lastUpdate: DateTime.now(),
        thumbnail: null,
        availableLanguages: { de: '/testumgebung/de/arbeit' },
      }),
    ]
    const overlappingSourceDocs = [
      new ExtendedDocumentModel({
        path: '/testumgebung/de/arbeit',
        title: 'Arbeit',
        content: 'Work Arbeit',
        lastUpdate: DateTime.now(),
        thumbnail: null,
        availableLanguages: { en: '/testumgebung/en/work' },
      }),
    ]

    const { result } = renderHook(() =>
      useMultiLanguageSearch({
        userLanguageDocuments: overlappingUserDocs,
        moreDocuments: overlappingSourceDocs,
        query: 'Work',
        userLanguageCode: 'en',
      }),
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data[0]).toEqual(overlappingUserDocs[0])
  })

  it('should return an empty array when no documents match the query', async () => {
    const { result } = renderHook(() =>
      useMultiLanguageSearch({
        userLanguageDocuments,
        moreDocuments: sourceLanguageDocuments,
        query: 'xyznotfound',
        userLanguageCode: 'en',
      }),
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual([])
  })

  it('should return no error and not be loading when done', async () => {
    const { result } = renderHook(() =>
      useMultiLanguageSearch({
        userLanguageDocuments,
        moreDocuments: [],
        query: 'Work',
        userLanguageCode: 'en',
      }),
    )
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBeNull()
  })
})
