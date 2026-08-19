import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OrganizationModel } from 'shared/api'

import HighlightBox from './HighlightBox'
import Link from './Link'
import SimpleImage from './SimpleImage'
import Text from './base/Text'

const Thumbnail = styled(SimpleImage)`
  height: 80px;
`

const Box = styled(HighlightBox)`
  margin-bottom: 16px;
  padding: 20px;
  border-radius: 4px;
`

const StyledLink = styled(Link)`
  padding: 0;
`

type OrganizationContentInfoProps = {
  organization: OrganizationModel
}

const OrganizationContentInfo = ({ organization }: OrganizationContentInfoProps): ReactElement => {
  const { t } = useTranslation(['categories'])
  return (
    <Box>
      <Thumbnail source={organization.logo} specifyAspectRatio />
      <View>
        <Text variant='h6' style={{ paddingTop: 16, paddingBottom: 8 }}>
          {t($ => $.organizationContent, { organization: organization.name })}
        </Text>
        <Text variant='body2' style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Trans
            ns='categories'
            i18nKey={$ => $.organizationMoreInformation}
            components={{
              1: <Text>{organization.name}</Text>,
              3: <StyledLink url={organization.url}>{new URL(organization.url).hostname}</StyledLink>,
            }}
          />
        </Text>
      </View>
    </Box>
  )
}

export default OrganizationContentInfo
