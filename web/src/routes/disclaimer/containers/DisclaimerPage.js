// @flow

import * as React from 'react'
import { useContext } from 'react'
import { PageModel } from 'api-client'
import Page from '../../../modules/common/components/Page'
import { push } from 'redux-first-router'
import DateFormatterContext from '../../../modules/i18n/context/DateFormatterContext'

type PropsType = {|
  disclaimer: PageModel
|}

/**
 * Displays the locations disclaimer matching the route /<location>/<language>/disclaimer
 */
const DisclaimerPage = ({
  disclaimer
}: PropsType) => {
  const formatter = useContext(DateFormatterContext)
  return (
    <Page lastUpdate={disclaimer.lastUpdate}
          title={disclaimer.title}
          content={disclaimer.content}
          formatter={formatter}
          onInternalLinkClick={push} />
  )
}

export default DisclaimerPage
