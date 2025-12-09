import React, { ReactElement, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import {
  ContactChannel,
  ContactGender,
  InvalidEmailError,
  OfferModel,
  submitMalteHelpForm,
  MALTE_HELP_FORM_MAX_COMMENT_LENGTH,
} from 'shared/api'

import useCityAppContext from '../hooks/useCityAppContext'
import useKeyboardHeight from '../hooks/useKeyboardHeight'
import useSnackbar from '../hooks/useSnackbar'
import LayoutedScrollView from './LayoutedScrollView'
import PrivacyCheckbox from './PrivacyCheckbox'
import Icon from './base/Icon'
import Text from './base/Text'
import TextButton from './base/TextButton'
import FormInput from './form/FormInput'
import FormRadioButtons from './form/FormRadioButtons'

const Container = styled(LayoutedScrollView)`
  padding: 16px;
  gap: 16px;
`

const InformationRow = styled.View`
  flex-direction: row;
  gap: 8px;
`

const InformationText = styled(Text)`
  font-family: ${props => props.theme.legacy.fonts.native.contentFontRegular};
  font-size: 14px;
  flex: 1;
`

const InputTitle = styled(Text)`
  font-weight: bold;
`

type FormInput = {
  name: string
  roomNumber: string
  email: string
  telephone: string
  contactChannel: ContactChannel
  contactGender: ContactGender
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
  categoryPageTitle: string
  url: string
  malteHelpFormOffer: OfferModel
  onSubmit: () => void
  cityCode: string
}

const MalteHelpFormOffer = ({
  categoryPageTitle,
  url,
  cityCode,
  malteHelpFormOffer,
  onSubmit,
}: MalteHelpFormOfferProps): ReactElement => {
  const { control, handleSubmit, formState, setError } = useForm<FormInput>({
    mode: 'onBlur',
    progressive: true,
    defaultValues,
  })
  const { t } = useTranslation('malteHelpForm')
  const { languageCode } = useCityAppContext()
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)
  const showSnackbar = useSnackbar()

  const submit = handleSubmit(async (data: FormInput) => {
    try {
      await submitMalteHelpForm({
        url,
        pageTitle: categoryPageTitle,
        cityCode,
        malteHelpFormOffer,
        name: data.name,
        roomNumber: data.roomNumber,
        email: data.email,
        telephone: data.telephone,
        contactChannel: data.contactChannel,
        contactGender: data.contactGender,
        comment: data.comment,
      })
      onSubmit()
      showSnackbar({ text: t('submitSuccessful') })
    } catch (e) {
      if (e instanceof InvalidEmailError) {
        setError('email', { type: 'custom', message: t('invalidEmailAddress') })
        showSnackbar({ text: t('invalidEmailAddress') })
      } else {
        showSnackbar({ text: t('error:unknownError') })
      }
    }
  })

  const keyboardHeight = useKeyboardHeight()

  return (
    <KeyboardAwareScrollView extraHeight={keyboardHeight - useSafeAreaInsets().bottom}>
      <Container>
        <InformationRow>
          <Icon source='account-multiple-outline' />
          <InformationText>{t('supportNote')}</InformationText>
        </InformationRow>
        <InformationRow>
          <Icon source='shield-plus-outline' />
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
              { key: 'any', label: t('contactPersonAnyGender') },
              { key: 'female', label: t('contactPersonGenderFemale') },
              { key: 'male', label: t('contactPersonGenderMale') },
            ]}
          />
        </View>

        <FormInput
          name='comment'
          title={t('contactReason')}
          hint={`(${t('maxCharacters', { numberOfCharacters: MALTE_HELP_FORM_MAX_COMMENT_LENGTH })})`}
          control={control}
          rules={{ maxLength: MALTE_HELP_FORM_MAX_COMMENT_LENGTH }}
          maxLength={MALTE_HELP_FORM_MAX_COMMENT_LENGTH}
          multiline
        />

        <InformationText>{t('responseDisclaimer')}</InformationText>
        <PrivacyCheckbox
          language={languageCode}
          checked={privacyPolicyAccepted}
          setChecked={setPrivacyPolicyAccepted}
        />
        <TextButton
          text={t('submit')}
          onPress={submit}
          disabled={!formState.isValid || formState.isSubmitting || !privacyPolicyAccepted}
        />
      </Container>
    </KeyboardAwareScrollView>
  )
}

export default MalteHelpFormOffer
