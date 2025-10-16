import React, { ReactElement } from 'react'

import { PageModel } from 'shared/api'

import Page from '../components/Page'

type DisclaimerProps = {
  disclaimer: PageModel
  language: string
}

const Disclaimer = ({ disclaimer, language }: DisclaimerProps): ReactElement => {
  const { title, content, lastUpdate } = disclaimer
  return <Page title={title} content={content} language={language} lastUpdate={lastUpdate} />
}

export default Disclaimer
