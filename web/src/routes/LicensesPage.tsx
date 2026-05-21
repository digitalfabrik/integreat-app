import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { parseLicenses } from 'shared'
import { useLoadAsync } from 'shared/api'

import Footer from '../components/Footer'
import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import LicenseItem from '../components/LicenseItem'
import H1 from '../components/base/H1'
import List from '../components/base/List'

const loadLicenses = async () => parseLicenses((await import('../assets/licenses.json')).default)

type LicensesPageProps = { languageCode: string }

const LicensesPage = ({ languageCode }: LicensesPageProps): ReactElement => {
  const { data: licenses } = useLoadAsync(loadLicenses)
  const { t } = useTranslation(['settings', 'licenses'])

  const items = (licenses ?? []).map(license => (
    <LicenseItem
      key={license.name}
      name={license.name}
      publisher={license.publisher}
      license={license.licenses}
      version={license.version}
      url={license.repository}
    />
  ))

  return (
    <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<Footer />}>
      <H1>{t('settings:openSourceLicenses')}</H1>
      <List items={items} NoItemsMessage={t('licenses:noLicensesMessage')} />
    </Layout>
  )
}

export default LicensesPage
