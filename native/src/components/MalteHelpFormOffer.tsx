import React, { ReactElement } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { MALTE_HELP_FORM_MAX_COMMENT_LENGTH, OfferModel, submitHelpForm } from 'api-client'

import { SecurityIcon, SupportIcon } from '../assets'
import useSnackbar from '../hooks/useSnackbar'
import Caption from './Caption'
import LayoutedScrollView from './LayoutedScrollView'
import Icon from './base/Icon'
import Text from './base/Text'
import TextButton from './base/TextButton'
import FormInput from './form/FormInput'
import FormRadioButtons from './form/FormRadioButtons'

const Container = styled(LayoutedScrollView)`
  padding: 0 16px 16px;
  gap: 16px;
`

const InformationRow = styled.View`
  flex-direction: row;
  gap: 8px;
`

const InformationText = styled.Text`
  flex: 1;
`

const InputTitle = styled.Text`
  font-weight: bold;
`

type FormInput = {
  name: string
  roomNumber: string
  email: string
  telephone: string
  contactChannel: 'email' | 'telephone' | 'personally'
  contactGender: 'female' | 'male' | 'any'
  comment: string
}

const defaultValues: FormInput = {
  name: '',
  roomNumber: '',
  email: '',
  telephone: '',
  contactChannel: 'email',
  contactGender: 'any',
  comment: '',
}

type MalteHelpFormOfferProps = {
  malteHelpFormOffer: OfferModel
  onSubmit: () => void
  cityCode: string
  languageCode: string
}

const MalteHelpFormOffer = ({
  cityCode,
  languageCode,
  malteHelpFormOffer,
  onSubmit,
}: MalteHelpFormOfferProps): ReactElement => {
  const { control, handleSubmit, formState } = useForm<FormInput>({ defaultValues })
  const { t } = useTranslation('malteHelpForm')
  const showSnackbar = useSnackbar()

  const submit = handleSubmit(async _data => {
    try {
      await submitHelpForm({ cityCode, languageCode, helpButtonOffer: malteHelpFormOffer })
      onSubmit()
      showSnackbar({ text: t('submitSuccessful') })
    } catch (e) {
      showSnackbar({ text: t('error:unknownError') })
    }
  })

  return (
    <Container>
      <Caption title={t('title')} />

      <InformationRow>
        <Icon Icon={SupportIcon} />
        <InformationText>{t('supportNote')}</InformationText>
      </InformationRow>
      <InformationRow>
        <Icon Icon={SecurityIcon} />
        <InformationText>{t('securityNote')}</InformationText>
      </InformationRow>

      <FormInput name='name' title={t('name')} control={control} rules={{ required: true }} />
      <FormInput name='roomNumber' title={t('roomNumber')} control={control} showOptional />

      <View>
        <InputTitle>{t('howToBeContacted')}</InputTitle>
        <FormRadioButtons
          name='contactChannel'
          control={control}
          values={[
            { key: 'email', label: t('eMail'), inputName: 'email' },
            { key: 'telephone', label: t('telephone'), inputName: 'telephone' },
            { key: 'personally', label: t('personally') },
          ]}
        />
      </View>

      <View>
        <InputTitle>{t('contactPerson')}</InputTitle>
        <FormRadioButtons
          name='contactGender'
          control={control}
          values={[
            { key: 'any', label: t('any') },
            { key: 'female', label: t('female') },
            { key: 'male', label: t('male') },
          ]}
        />
      </View>

      <FormInput
        name='comment'
        title={t('contactReason')}
        hint={`(${t('maxCharacters', { numberOfCharacters: MALTE_HELP_FORM_MAX_COMMENT_LENGTH })})`}
        control={control}
        rules={{ maxLength: MALTE_HELP_FORM_MAX_COMMENT_LENGTH }}
        multiline
      />

      <Text>{t('responseDisclaimer')}</Text>
      <TextButton text={t('submit')} onPress={submit} disabled={!formState.isValid} />
    </Container>
  )
}

export default MalteHelpFormOffer
