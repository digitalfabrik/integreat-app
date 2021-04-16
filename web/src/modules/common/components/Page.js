// @flow

import * as React from 'react'
import { sanitize } from "dompurify";
import styled, { type StyledComponent } from 'styled-components'
import RemoteContent from './RemoteContent'
import Caption from './Caption'
import type Moment from 'moment'
import LastUpdateInfo from './LastUpdateInfo'
import DateFormatter from 'api-client/src/i18n/DateFormatter'
import type { ThemeType } from 'build-configs/ThemeType'

export const THUMBNAIL_WIDTH = 300

const Thumbnail: StyledComponent<{||}, ThemeType, *> = styled.img`
  display: flex;
  width: ${THUMBNAIL_WIDTH}px;
  height: ${THUMBNAIL_WIDTH}px;
  margin: 10px auto;
  padding-bottom: 10px;
  object-fit: contain;
`

type PropsType = {|
  title: string,
  defaultThumbnailSrc?: string, // necessary for IE11 support
  thumbnailSrcSet?: ?string,
  content: string,
  lastUpdate?: Moment,
  showLastUpdateText?: boolean,
  lastUpdateFormat?: string,
  formatter: DateFormatter,
  onInternalLinkClick: string => void,
  children?: React.Node
|}

/**
 * Display a single page with all necessary information
 */
const Page = ({
  title,
  defaultThumbnailSrc,
  thumbnailSrcSet,
  content,
  lastUpdate,
  showLastUpdateText = true,
  lastUpdateFormat,
  formatter,
  children,
  onInternalLinkClick
}: PropsType) => {
  return (
    <>
      {defaultThumbnailSrc && <Thumbnail alt='' src={defaultThumbnailSrc} srcSet={thumbnailSrcSet} />}
      <Caption title={title} />
      {children}
      <RemoteContent dangerouslySetInnerHTML={{ __html: sanitize(content) }} onInternalLinkClick={onInternalLinkClick} />
      {lastUpdate && (
        <LastUpdateInfo
          lastUpdate={lastUpdate}
          format={lastUpdateFormat}
          formatter={formatter}
          withText={showLastUpdateText}
        />
      )}
    </>
  )
}

export default Page
