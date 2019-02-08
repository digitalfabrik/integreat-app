// @flow

import type { StateType } from '../../../modules/app/StateType'
import compose from 'lodash/fp/compose'
import connect from 'react-redux/es/connect/connect'
import Events from './Events'
import { translate } from 'react-i18next'
import { CityModel, DateModel, EventModel, LocationModel } from '@integreat-app/integreat-api-client'
import moment from 'moment'

const mapStateToProps = (state: StateType, ownProps) => {
  const language: string = state.language
  const targetCity: CityModel = ownProps.navigation.getParam('cityModel')
  const path: string = ownProps.navigation.getParam('path')

  const navigateToEvent = (path: ?string = null) => {
    if (ownProps.navigation.push) {
      const params = {cityModel: targetCity, path: path}
      ownProps.navigation.push('Events', params)
    }
  }
  const fileCache = state.fileCache[targetCity.code]

  if (!fileCache || !fileCache.ready || fileCache.error) {
    throw new Error('There are no files in state!')
  }

  // MOCK Data, TODO
  const events = [
    {
      id: 9886,
      url: 'https://cms.integreat-app.de/augsburg/de/events/qualifizierung-in-kultursensibler-altenpflege-kap-fuer-gefluechtete/',
      path: '/augsburg/de/events/qualifizierung-in-kultursensibler-altenpflege-kap-fuer-gefluechtete/',
      title: 'Qualifizierung in Kultursensibler Altenpflege (KAP) für Geflüchtete',
      modified_gmt: '2018-12-12 12:24:33',
      excerpt: '18/02/2019 &#8211; 12/07/2019 @ 8:30 &#8211; 16:00 &#8211; Vorbereitung zur Aufnahme einer Ausbildung im Pflegebereich Anmeldeschluss 31.01.2019 Geeignete Teilnehmende für den KAP-Kurs sind: Geflüchtete mit Zugang zum Arbeitsmarkt (bei Beschäftigungsverbot bitte Kontaktaufnahme mit Sabine Reiter) volljährige Personen, die Interesse an der Pflege haben (oder im Herkunftsland in der Pflege gearbeitet haben) Personen, denen es möglich ist, die Kurszeiten Montag bis Freitag täglich von [&#8230;]',
      content: '<p>Vorbereitung zur Aufnahme einer Ausbildung im Pflegebereich</p> <p><strong>Anmeldeschluss 31.01.2019</strong></p> <p><strong>Geeignete Teilnehmende</strong> für den KAP-Kurs sind:</p> <ul> <li>Geflüchtete mit Zugang zum Arbeitsmarkt (bei Beschäftigungsverbot bitte Kontaktaufnahme mit Sabine Reiter)</li> <li>volljährige Personen, die Interesse an der Pflege haben (oder im Herkunftsland in der Pflege gearbeitet haben)</li> <li>Personen, denen es möglich ist, die Kurszeiten Montag bis Freitag täglich von 8:30 Uhr bis 16:00 Uhr einzuhalten</li> <li>Personen, mit denen Sie sich als Berater/-innen auf Deutsch verständigen können (BAVF führt nach der Anmeldung eine Sprachstandsfeststellung durch)</li> </ul> <p><strong>Was lernen Sie:</strong></p> <ul> <li>Grundlegende Kenntnisse der Alten- und Krankenpflege (Theorie: Körper, Krankheiten, Hygiene)</li> <li>pflegerische Tätigkeiten (z.B. Waschen)</li> <li>berufsbezogenes Deutsch für die Pflege</li> <li>Kultursensibler Unterricht</li> <li>Praktikum auf einer Pflegestation</li> </ul> <p>Nähere Infos <a href="http://cms.integreat-app.de/augsburg/wp-content/uploads/sites/2/2018/12/181206-KAP_Flyer.pdf">hier</a></p>',
      available_languages: [],
      thumbnail: null,
      event: {
        id: 122,
        start_date: '2019-02-18',
        end_date: '2019-07-12',
        all_day: false,
        start_time: '08:30:00',
        end_time: '16:00:00',
        recurrence_id: null
      },
      location: {
        id: 17,
        name: 'VHS Augsburg',
        address: 'Willy-Brandt-Platz 3a',
        town: 'Augsburg',
        state: 'Bayern',
        postcode: '86153',
        region: 'Schwaben',
        country: 'DE',
        latitude: null,
        longitude: null
      },
      hash: 'f56e4bd8a86faeb52f1b831f054f39f3'
    },
    {
      id: 9920,
      url: 'https://cms.integreat-app.de/augsburg/de/events/mietkurs-fuer-neuzugewanderte-3/',
      path: '/augsburg/de/events/mietkurs-fuer-neuzugewanderte-3/',
      title: 'Mietkurs für Neuzugewanderte',
      modified_gmt: '2019-01-15 15:11:13',
      excerpt: '25/01/2019 @ 9:30 &#8211; 13:00 &#8211; Sie suchen eine neue Wohnung? Das &#8222;Wohnprojekt Augsburg&#8220; macht wieder Mietkurse. In dem Kurs lernen Sie wichtige Informationen zum Thema Wohnungssuche: Wie kann ich eine Wohnung finden? Was sind Mietobergrenzen? Welche Rechte und Pflichten habe ich als Mieter? Der Kurs findet auf Deutsch statt und dauert einen Vormittag. Am Ende bekommen Sie ein Zertifikat. Damit [&#8230;]',
      content: '<p>Sie suchen eine neue Wohnung? Das "Wohnprojekt Augsburg" macht wieder Mietkurse. In dem Kurs lernen Sie wichtige Informationen zum Thema Wohnungssuche: Wie kann ich eine Wohnung finden? Was sind Mietobergrenzen? Welche Rechte und Pflichten habe ich als Mieter? Der Kurs findet auf Deutsch statt und dauert einen Vormittag. Am Ende bekommen Sie ein Zertifikat. Damit können Sie dann das Wohn-Café besuchen. Dort helfen Ihnen Ehrenamtliche, eine Wohnung zu finden.</p> <p>Anmelden können Sie sich immer freitags von 10-12 Uhr im Wohn-Café (Café Tür an Tür, Wertachstr. 29) oder per Mail an: corinna.hoeckesfeld@tuerantuer.de.</p>',
      available_languages: [],
      thumbnail: 'https://cms.integreat-app.de/testumgebung/wp-content/uploads/sites/154/2017/11/Erste-Schritte2-150x150.png',
      event: {
        id: 123,
        start_date: '2019-01-25',
        end_date: '2019-01-25',
        all_day: false,
        start_time: '09:30:00',
        end_time: '13:00:00',
        recurrence_id: null
      },
      location: {
        id: 6,
        name: 'zib (Zentrum für interkulturelle Beratung)',
        address: 'Wertachstr.29',
        town: 'Augsburg',
        state: null,
        postcode: null,
        region: null,
        country: 'DE',
        latitude: null,
        longitude: null
      },
      hash: 'de4a74220308e7abca3d5825d5aa4ce0'
    }
    // eslint-disable-next-line flowtype/no-weak-types
  ].map((event: any) => {
    const allDay = event.event.all_day
    return new EventModel({
      id: event.id,
      path: event.path,
      title: event.title,
      content: event.content,
      thumbnail: event.thumbnail,
      date: new DateModel({
        startDate: moment(`${event.event.start_date} ${allDay ? '00:00:00' : event.event.start_time}`),
        endDate: moment(`${event.event.end_date} ${allDay ? '23:59:59' : event.event.end_time}`),
        allDay: allDay
      }),
      location: new LocationModel({
        address: event.location.address,
        town: event.location.town,
        postcode: event.location.postcode,
        latitude: event.location.latitude,
        longitude: event.location.longitude
      }),
      excerpt: event.excerpt,
      lastUpdate: moment(event.modified_gmt)
    })
  }).sort((event1, event2) => {
    if (event1.date.startDate.isBefore(event2.date.startDate)) { return -1 }
    if (event1.date.startDate.isAfter(event2.date.startDate)) { return 1 }
    return 0
  })
  // End Mock data

  return {
    language: language,
    city: targetCity,
    events: events,
    path: path,
    navigateToEvent: navigateToEvent,
    files: fileCache.files
  }
}

export default compose(
  translate('events'),
  connect(mapStateToProps)
)(Events)
