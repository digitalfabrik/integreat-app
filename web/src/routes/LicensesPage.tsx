import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { License, parseLicenses } from 'api-client'

import Caption from '../components/Caption'
import GeneralFooter from '../components/GeneralFooter'
import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import LicenseItem from '../components/LicenseItem'
import List from '../components/List'
import { reportError } from '../utils/sentry'

type LicensesPageProps = { languageCode: string }
const LicensesPage = ({ languageCode }: LicensesPageProps): ReactElement => {
  const { t } = useTranslation(['settings', 'licenses'])
  const [licenses, setLicenses] = useState<License[] | null>(null)

  useEffect(() => {
    import('../../assets/licenses.json')
      .then(licenseFile => setLicenses(parseLicenses(licenseFile.default)))
      .catch(error => reportError(`error while importing licenses ${error}`))
  }, [])

  const renderItem = (item: License) => (
    <LicenseItem
      key={item.name}
      name={item.name}
      license={item.licenses}
      version={item.version}
      licenseUrl={item.licenseUrl}
    />
  )

  return (
    <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<GeneralFooter language={languageCode} />}>
      <Caption title={t('settings:openSourceLicenses')} />
      <List items={licenses ?? []} renderItem={renderItem} noItemsMessage={t('licenses:noLicensesMessage')} />
    </Layout>
  )
}

export default LicensesPage
