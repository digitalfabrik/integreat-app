import { useParams } from 'react-router'

const useCityContentParams = (): { cityCode: string; languageCode: string } => {
  const params = useParams()
  // This hook should only be used in city content routes where it is guaranteed that both city and language code are set
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { cityCode: params.cityCode!, languageCode: params.languageCode! }
}

export default useCityContentParams
