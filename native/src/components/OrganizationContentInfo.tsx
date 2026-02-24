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
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
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
  const { t } = useTranslation('categories')
  return (
    <Box>
      <Thumbnail source={organization.logo} specifyAspectRatio />
      <View>
        <Text variant='h6' style={{ paddingTop: 16, paddingBottom: 8 }}>
          {t('organizationContent', { organization: organization.name })}
        </Text>
        <Text variant='body2' style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Trans i18nKey='categories:organizationMoreInformation' domain={new URL(organization.url).hostname}>
            This gets{{ organization: organization.name }}replaced
            {/* @ts-expect-error gets replaced by Trans component */}
            <StyledLink url={organization.url}>{{ domain: new URL(organization.url).hostname }}</StyledLink>
            by i18n
          </Trans>
        </Text>
      </View>
    </Box>
  )
}

export default OrganizationContentInfo
