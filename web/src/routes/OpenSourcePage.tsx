import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { parseLicenses } from 'shared'
import { useLoadAsync } from 'shared/api'

import Footer from '../components/Footer'
import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import OpenSourceListItem from '../components/OpenSourceListItem'
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
  const linkToSbomDownload = `https://github.com/digitalfabrik/integreat-app/releases/tag/${__VERSION_NAME__}/sbom.spdx.json`
  const linkToGithub = 'https://github.com/digitalfabrik/integreat-app'

  const items = (licenses ?? []).map(license => (
    <OpenSourceListItem
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
      <H1>{t($ => $.about.openSources.title)}</H1>
      <Stack spacing={1}>
        <Typography variant='body1' component='h2'>
          <Trans
            ns='about'
            i18nKey={$ => $.about.openSources.sourceCode}
            values={{ appName: buildConfig().appName }}
            components={{ Link: <Link to={linkToGithub} highlighted /> }}
          />
        </Typography>
        <Typography variant='body1' component='h2'>
          <Trans
            ns='about'
            i18nKey={$ => $.about.openSources.sbom}
            components={{ Link: <Link to={linkToSbomDownload} highlighted /> }}
          />
        </Typography>
        <Box aria-labelledby='licenses-heading'>
          <Typography id='licenses-heading' variant='subtitle1' component='h2'>
            {t($ => $.about.openSources.licenses.title)}
          </Typography>
          {loading ? <SkeletonList /> : <List items={items} />}
        </Box>
      </Stack>
    </Layout>
  )
}

export default OpenSourcePage
