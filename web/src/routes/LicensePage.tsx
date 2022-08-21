import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { License, parseLicenses } from 'api-client/src/utils/licences'

import Caption from '../components/Caption'
import List from '../components/List'
import ListItem from '../components/ListItem'
import { reportError } from '../utils/sentry'

const LicenseContainer = styled.div`
  padding: 5px 10px;
  line-height: 120%;
`

type PropsType = {
  name: string
  version: string | undefined
  license: string
  onPress: string
}

const LicenseItem = ({ license, name, onPress, version }: PropsType): ReactElement => (
  <ListItem path={onPress} title={name}>
    <LicenseContainer>
      <div>{`version: ${version}`}</div>
      <div>{`license: ${license}`}</div>
    </LicenseContainer>
  </ListItem>
)

const LicensePage = (): ReactElement => {
  const { t } = useTranslation('settings')
  const [licenses, setLicenses] = useState<License[] | null>(null)

  useEffect(() => {
    import('../../assets/licenses.json')
      .then(licenseFile => setLicenses(parseLicenses(licenseFile.default)))
      .catch(error => reportError(`error while importing licenses ${error}`))
  }, [])

  const renderItem = (item: License) => (
    <LicenseItem name={item.name} license={item.licenses} version={item.version} onPress={item.licenseUrl} />
  )

  return (
    <div>
      <Caption title={t('openSourceLicenses')} />
      <List items={licenses ?? []} renderItem={renderItem} noItemsMessage='' />
    </div>
  )
}

export default LicensePage
