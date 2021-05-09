import * as React from "react";
import styled from "styled-components/native";
import type { StyledComponent } from "styled-components";
import "styled-components";
import type { ThemeType } from "build-configs/ThemeType";
import Touchable from "../../../modules/platform/components/Touchable";
import type { AccessibilityRole } from "react-native/Libraries/Components/View/ViewAccessibility";
import { Badge, Icon } from "react-native-elements";
import { Switch, Text, View } from "react-native";
import type { TFunction } from "react-i18next";
type PropType = {
  title: string;
  description: string | null | undefined;
  onPress: (() => void) | null | undefined;
  theme: ThemeType;
  t: TFunction;
  bigTitle?: boolean;
  accessibilityRole?: AccessibilityRole;
  hasSwitch?: boolean;
  hasBadge?: boolean;
  value: boolean;
};
const PadView: StyledComponent<{}, ThemeType, any> = styled.View`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.backgroundColor};
  padding-vertical: 8px;
`;
const RightContentContainer = styled.View`
  flex: 0.4;
  justify-content: center;
  align-items: flex-end;
`;
const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: flex-start;
`;
const Title: StyledComponent<{
  bigTitle: boolean;
}, ThemeType, any> = styled.Text`
  color: ${props => props.theme.colors.textColor};
  ${props => props.bigTitle ? 'font-size: 18px;' : ''}
`;
const Description = styled.Text`
  color: ${props => props.theme.colors.textSecondaryColor};
`;

const SettingItem = (props: PropType) => {
  const {
    title,
    description,
    onPress,
    value,
    hasBadge,
    hasSwitch,
    bigTitle,
    theme,
    accessibilityRole,
    t
  } = props;
  return <Touchable onPress={onPress} accessibilityRole={accessibilityRole}>
      <PadView theme={theme}>
        <ContentContainer>
          <View>
            <Title theme={theme} bigTitle={bigTitle || false}>
              {title}
            </Title>
          </View>
          {description && <View>
              <Description theme={theme}>{description}</Description>
            </View>}
        </ContentContainer>
        <RightContentContainer>
          {hasSwitch && <Switch thumbColor={theme.colors.themeColor} trackColor={{
          true: theme.colors.themeColor
        }} value={value} onValueChange={onPress} />}
          {hasBadge && <View style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
              <Badge status={value ? 'success' : 'error'} />
              <Text> {value ? t('enabled') : t('disabled')}</Text>
              <Icon name='chevron-right' />
            </View>}
        </RightContentContainer>
      </PadView>
    </Touchable>;
};

export default SettingItem;