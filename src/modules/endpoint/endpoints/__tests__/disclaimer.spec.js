import disclaimer from '../disclaimer'
import PageModel from '../../models/PageModel'

describe('disclaimer', () => {
  test('should map state to urls', () => {
    expect(disclaimer.mapStateToUrlParams({router: {params: {location: 'augsburg', language: 'de'}}}))
      .toEqual({location: 'augsburg', language: 'de'})
  })

  test('should map fetched data to models', () => {
    const pageJson = {
      id: 1689,
      permalink: {
        url_page: 'feedback-kontakt-und-moegliches-engagement'
      },
      title: 'Feedback, Kontakt und mögliches Engagement',
      type: 'disclaimer',
      status: 'publish',
      modified_gmt: '2017-06-12 12:27:57',
      excerpt: 'Excerpt',
      content: '<span>Content</span>',
      parent: 0,
      available_languages: {
        en: 7380,
        ar: 7386,
        fa: 7387
      }
    }

    const disclaimerPage = disclaimer.mapResponse([pageJson])

    expect(disclaimerPage).toEqual(new PageModel({
      id: pageJson.permalink.url_page,
      numericId: pageJson.id,
      title: pageJson.title,
      parent: pageJson.parent,
      content: pageJson.content,
      thumbnail: pageJson.thumbnail,
      order: pageJson.order,
      children: [],
      availableLanguages: pageJson.available_languages
    }))
  })
})
