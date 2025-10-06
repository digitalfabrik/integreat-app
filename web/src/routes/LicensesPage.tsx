import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { License, parseLicenses } from 'shared'

import Caption from '../components/Caption'
import Footer from '../components/Footer'
import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import LicenseItem from '../components/LicenseItem'
import List from '../components/base/List'
import { reportError } from '../utils/sentry'

type LicensesPageProps = { languageCode: string }
const LicensesPage = ({ languageCode }: LicensesPageProps): ReactElement => {
  const { t } = useTranslation(['settings', 'licenses'])
  const [licenses, setLicenses] = useState<License[] | null>(null)

  useEffect(() => {
    import('../assets/licenses.json')
      .then(licenseFile => setLicenses(parseLicenses(licenseFile.default)))
      .catch(error => reportError(`error while importing licenses ${error}`))
  }, [])

  const items = (licenses ?? []).map(license => (
    <LicenseItem
      key={license.name}
      name={license.name}
      license={license.licenses}
      version={license.version}
      licenseUrl={license.licenseUrl}
    />
  ))

  return (
    <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<Footer />}>
      <Caption title={t('settings:openSourceLicenses')} />
      <List items={items} NoItemsMessage={t('licenses:noLicensesMessage')} />
    </Layout>
  )
}

export default LicensesPage
