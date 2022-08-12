import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { License, parseLicenses } from 'api-client/src/utils/licences'

import Caption from '../components/Caption'
import List from '../components/List'
import ListItem from '../components/ListItem'
import { reportError } from '../utils/sentry'

const LicenseContainer = styled.div`
  padding: 5px 15px;
  line-height: 120%;
`

type PropsType = {
  name: string
  version: string | undefined
  license: string
  onPress: string
}

const LicenseItem = (props: PropsType): ReactElement => {
  const { name, version, license, onPress } = props
  return (
    <ListItem path={onPress} title={name}>
      <LicenseContainer>
        {`version: ${version}`}
        <br />
        {`license: ${license}`}
      </LicenseContainer>
    </ListItem>
  )
}

const LicensePage = (): ReactElement => {
  const { t } = useTranslation('settings')
  const [licenses, setLicenses] = useState<License[]>([])

  useEffect(() => {
    import('../../assets/licenses.json')
      // @ts-expect-error JSON is guaranteed to be of type JsonLicenses
      .then(licenseFile => setLicenses(parseLicenses(licenseFile.default)))
      .catch(error => reportError(`error while importing licenses ${error}`))
  }, [])

  const renderItem = (item: License) => (
    <LicenseItem name={item.name} license={item.licenses} version={item.version} onPress={item.licenseUrl} />
  )

  return (
    <div>
      <Caption title={t('openSourceLicenses')} />
      <List items={licenses} renderItem={renderItem} noItemsMessage='TODO' />
    </div>
  )
}

export default LicensePage
