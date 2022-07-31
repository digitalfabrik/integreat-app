import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { License, parseLicenses } from 'api-client/src/utils/licences'
import styled from 'styled-components'
import List from '../components/List'
import ListItem from '../components/ListItem'
import { reportError } from '../utils/sentry'
import Caption from '../components/Caption'


const LicenseContainer = styled.div`
  display: block;
  padding: 15px 5px;
  word-wrap: break-word;
`

type PropsType = {
  name: string,
  version: string | undefined,
  license: string,
  onPress: string
}

const LicenseItem = (props: PropsType): ReactElement => {
  const { name, version, license, onPress } = props
  return (
    <LicenseContainer>
      <ListItem path={onPress} title={name}>
        {`version: ${version}`}
        <br />
        {`license: ${license}`}
      </ListItem>
    </LicenseContainer>
  )
}


const LicensePage = (): ReactElement => {

  const { t } = useTranslation('settings')
  const [licenses, setLicenses] = useState<License[]>([])
  // const showSnackbar = useSnackbar()

  useEffect(() => {
    import('../../assets/licenses.json')
      // @ts-expect-error JSON is guaranteed to be of type JsonLicenses
      .then(licenseFile => setLicenses(parseLicenses(licenseFile.default)))
      .catch(error => reportError(`error while importing licenses ${error}`))
  }, [])
  const renderItem = (item: License) => <LicenseItem name={item.name}
                                                     license={item.licenses}
                                                     version={item.version}
                                                     onPress={item.licenseUrl} />

  return (
    <div>
      <Caption title={t('openSourceLicenses')} />
      <List items={licenses} renderItem={renderItem} noItemsMessage={'todo'} />
    </div>
  )
}

export default LicensePage