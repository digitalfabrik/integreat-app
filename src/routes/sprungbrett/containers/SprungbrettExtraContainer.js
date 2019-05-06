// @flow

import { translate } from 'react-i18next'
import SprungbrettExtra from '../components/SprungbrettExtra'
import compose from 'lodash/fp/compose'
import connect from 'react-redux/es/connect/connect'
import type { StateType } from '../../../modules/app/StateType'
import { ExtraModel, SprungbrettJobModel } from '@integreat-app/integreat-api-client'

const mapStateToProps = (state: StateType, ownProps) => {
  const extras: Array<ExtraModel> = ownProps.navigation.getParam('extras')

  // MockData:
  const sprungbrettJobs = {
    total: 18,
    pager: {
      current: 1,
      max: 1
    },
    results: [
      {
        title: 'Praktikum im Bereich Soziale Betreuung und Pflege älterer Menschen',
        apprenticeship: '1',
        employment: '0',
        zip: '86150',
        city: 'Augsburg',
        lat: '48.364660',
        lon: '10.882451',
        groupName: 'Gymnasium/FOS/BOS',
        branchName: 'Gesundheit, Soziales, Lehre & Erziehung',
        distance: '1.223124064236733',
        url: 'https://www.sprungbrett-intowork.de/fluechtlinge/praktika/' +
          '?no_cache=1&tx_sprungbretttemplates_internshipdetail%5BinternshipUid%5D=6020'
      },
      {
        title: 'Pflegefachhelfer/in Altenpflege',
        apprenticeship: '1',
        employment: '0',
        zip: '86150',
        city: 'Augsburg',
        lat: '48.364660',
        lon: '10.882451',
        groupName: 'Mittelschule',
        branchName: 'Gesundheit, Soziales, Lehre & Erziehung',
        distance: '1.223124064236733',
        url: 'https://www.sprungbrett-intowork.de/fluechtlinge/praktika/' +
          '?no_cache=1&tx_sprungbretttemplates_internshipdetail%5BinternshipUid%5D=11938'
      },
      {
        title: 'Praktikum im Verkauf',
        apprenticeship: '1',
        employment: '0',
        zip: '86156',
        city: 'Augsburg',
        lat: '48.384186',
        lon: '10.857525',
        groupName: 'Mittelschule',
        branchName: 'Kaufm.Dienstleist., Warenhandel, Vertrieb, Hotel & Tourismus',
        distance: '3.6020487326272486',
        url: 'https://www.sprungbrett-intowork.de/fluechtlinge/praktika/' +
          '?no_cache=1&tx_sprungbretttemplates_internshipdetail%5BinternshipUid%5D=12117'
      },
      {
        title: 'Einführung und Kennenlernen des Berufes des Gärtners - Fachbereich Baumschule',
        apprenticeship: '1',
        employment: '0',
        zip: '86391',
        city: 'Stadtbergen',
        lat: '48.358586',
        lon: '10.850551',
        groupName: 'Realschule',
        branchName: 'Natur / Tiere / Umwelt',
        distance: '3.6708118806476318',
        url: 'https://www.sprungbrett-intowork.de/fluechtlinge/praktika/' +
          '?no_cache=1&tx_sprungbretttemplates_internshipdetail%5BinternshipUid%5D=12628'
      },
      {
        title: 'PRAKTIKA FACHKRAFT FÜR MÖBEL KÜCHEN UND UMZUGSSERVICE',
        apprenticeship: '1',
        employment: '1',
        zip: '86179',
        city: 'AUGSBURG',
        lat: '48.320070',
        lon: '10.889401',
        groupName: 'Mittelschule',
        branchName: 'Rohstoffgewinnung & -verarbeitung, Produktion & Fertigung',
        distance: '5.238745348039687',
        url: 'https://www.sprungbrett-intowork.de/fluechtlinge/praktika/' +
          '?no_cache=1&tx_sprungbretttemplates_internshipdetail%5BinternshipUid%5D=12463'
      },
      {
        title: 'FACHLAGERIST',
        apprenticeship: '1',
        employment: '1',
        zip: '86179',
        city: 'AUGSBURG',
        lat: '48.320070',
        lon: '10.889401',
        groupName: 'Mittelschule',
        branchName: 'Verkehr & Logistik, Schutz & Sicherheit',
        distance: '5.238745348039687',
        url: 'https://www.sprungbrett-intowork.de/fluechtlinge/praktika/' +
          '?no_cache=1&tx_sprungbretttemplates_internshipdetail%5BinternshipUid%5D=12464'
      },
      {
        title: 'Kauffrau/mann für Büromanagement',
        apprenticeship: '1',
        employment: '0',
        zip: '86179',
        city: 'Augsburg',
        lat: '48.319082',
        lon: '10.892141',
        groupName: null,
        branchName: 'Unternehmensorganisation, Buchhaltung, Recht & Verwaltung',
        distance: '5.325410061851195',
        url: 'https://www.sprungbrett-intowork.de/fluechtlinge/praktika/' +
          '?no_cache=1&tx_sprungbretttemplates_internshipdetail%5BinternshipUid%5D=12200'
      }]
  }.results
    .map((job, index) => new SprungbrettJobModel({
      id: index,
      title: job.title,
      location: `${job.zip} ${job.city}`,
      url: job.url,
      isEmployment: job.employment === '1',
      isApprenticeship: job.apprenticeship === '1'
    }))

  return {
    sprungbrettJobs: sprungbrettJobs,
    extras: extras
  }
}

export default compose(
  connect(mapStateToProps),
  translate('sprungbrett')
)(SprungbrettExtra)
