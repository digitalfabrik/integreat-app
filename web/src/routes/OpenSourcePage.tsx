import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { parseLicenses, repoUrl, sbomUrl } from 'shared'
import { useLoadAsync } from 'shared/api'

import Footer from '../components/Footer'
import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import LicenseListItem from '../components/LicenseListItem'
import SkeletonList from '../components/SkeletonList'
import H1 from '../components/base/H1'
import Link from '../components/base/Link'
import List from '../components/base/List'
import buildConfig from '../constants/buildConfig'

const loadLicenses = async () => parseLicenses((await import('../assets/licenses.json')).default)

type OpenSourcePageProps = { languageCode: string }

const OpenSourcePage = ({ languageCode }: OpenSourcePageProps): ReactElement => {
  const { data: licenses, loading } = useLoadAsync(loadLicenses)
  const { t } = useTranslation()

  const items = (licenses ?? []).map(license => (
    <LicenseListItem
      key={license.name}
      name={license.name}
      author={license.author}
      license={license.license}
      version={license.version}
      url={license.repository}
    />
  ))

  return (
    <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<Footer />}>
      <H1>{t($ => $.about.openSource.title)}</H1>
      <Stack spacing={1}>
        <Typography variant='body1' component='p'>
          <Trans
            ns='about'
            i18nKey={$ => $.about.openSource.sourceCode}
            values={{ appName: buildConfig().appName }}
            components={{ Link: <Link to={repoUrl} highlighted /> }}
          />
        </Typography>
        <Typography variant='body1' component='p'>
          <Trans
            ns='about'
            i18nKey={$ => $.about.openSource.sbom}
            components={{ Link: <Link to={sbomUrl(__VERSION_NAME__)} highlighted /> }}
          />
        </Typography>
        <Box>
          <Typography variant='subtitle1' component='h2'>
            {t($ => $.about.openSource.licenses.title)}
          </Typography>
          {loading ? <SkeletonList /> : <List items={items} />}
        </Box>
      </Stack>
    </Layout>
  )
}

export default OpenSourcePage
