import * as React from "react";
import { useContext } from "react";
import { LocalNewsModel, TunewsModel } from "api-client";
import styled from "styled-components/native";
import type { TFunction } from "react-i18next";
import "react-i18next";
import type { ThemeType } from "build-configs/ThemeType";
import type { StyledComponent } from "styled-components";
import "styled-components";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { contentDirection, contentAlignment } from "../../../modules/i18n/contentDirection";
import { config } from "translations";
import { Parser } from "htmlparser2";
import TimeStamp from "../../../modules/common/components/TimeStamp";
import DateFormatterContext from "../../../modules/i18n/context/DateFormatterContext";
type PropsType = {
  newsItem: LocalNewsModel | TunewsModel;
  language: string;
  navigateToNews: () => void;
  theme: ThemeType;
  t: TFunction;
  isTunews: boolean;
};
type ListItemViewPropsType = {
  language: string;
  children: React.ReactNode;
  theme: ThemeType;
};
const ListItemView: StyledComponent<ListItemViewPropsType, ThemeType, any> = styled.View`
  flex-direction: ${props => contentDirection(props.language)};
`;
const ReadMoreWrapper: StyledComponent<{
  language: string;
  children: React.ReactNode;
}, {}, any> = styled.View`
  flex-direction: ${props => contentDirection(props.language)};
  justify-content: flex-end;
  width: 100%;
  align-self: center;
`;
const Icon: StyledComponent<{
  isTunews: boolean | null | undefined;
}, ThemeType, any> = styled(MaterialIcon)`
  font-size: 20px;
  top: 4px;
  right: 5px;
  left: 0px;
  color: ${props => props.isTunews ? props.theme.colors.tunewsThemeColor : props.theme.colors.themeColor};
`;
const ListItemWrapper = styled.View`
  padding-horizontal: 5%;
`;
const StyledTouchableOpacity: StyledComponent<{}, ThemeType, any> = styled.TouchableOpacity`
  flex-direction: column;
`;
const Divider: StyledComponent<{}, ThemeType, any> = styled.View`
  border-top-width: 0.5px;
  border-top-color: rgba(168, 168, 168, 0.7);
  width: 80%;
  margin-top: 12px;
  margin-bottom: 12px;
  align-self: center;
`;
export const Description: StyledComponent<{}, ThemeType, any> = styled.View`
  flex-direction: column;
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`;
export const Title: StyledComponent<{}, ThemeType, any> = styled.Text`
  font-weight: 700;
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  color: ${props => props.theme.colors.textColor};
  font-size: 16px;
  margin-bottom: 8px;
  margin-top: 8px;
`;
export const Content: StyledComponent<{
  language: string;
}, ThemeType, any> = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  font-size: 14px;
  letter-spacing: 0.5px;
  text-align: ${props => contentAlignment(props.language)};
  color: ${props => props.theme.colors.textColor};
`;
const TimeStampContent: StyledComponent<{
  language: string;
}, ThemeType, any> = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  font-size: 14px;
  padding: 10px 0px
  text-align: ${props => contentAlignment(props.language)};
  color: ${props => props.theme.colors.textColor};
`;
export const ReadMore: StyledComponent<{
  isTunews: boolean | null | undefined;
}, ThemeType, any> = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  font-size: 12px;
  letter-spacing: 0.5px;
  margin-top: 5px;
  color: ${props => props.isTunews ? props.theme.colors.tunewsThemeColor : props.theme.colors.themeColor};
`;

const NewsListItem = ({
  newsItem,
  language,
  navigateToNews,
  theme,
  t,
  isTunews
}: PropsType) => {
  const formatter = useContext(DateFormatterContext);
  const localNewsContent = newsItem instanceof LocalNewsModel ? newsItem.message : '';
  const tuNewsContent = newsItem instanceof TunewsModel ? newsItem.content : '';
  const content = localNewsContent || tuNewsContent;
  const timestamp = newsItem instanceof LocalNewsModel ? newsItem.timestamp : null;
  // Decode html entities
  let decodedContent = '';
  const parser = new Parser({
    ontext(data: string) {
      decodedContent += data;
    }

  }, {
    decodeEntities: true
  });
  parser.write(content);
  parser.end();
  return <>
      <Divider />
      <ListItemWrapper>
        <StyledTouchableOpacity onPress={navigateToNews} theme={theme}>
          <Description theme={theme}>
            <ListItemView language={language} theme={theme}>
              <Title theme={theme}>{newsItem.title}</Title>
            </ListItemView>
            <ListItemView language={language} theme={theme}>
              <Content numberOfLines={5} language={language} theme={theme}>
                {decodedContent}
              </Content>
            </ListItemView>
            {timestamp && <ListItemView language={language} theme={theme}>
                <TimeStampContent language={language} theme={theme}>
                  <TimeStamp formatter={formatter} lastUpdate={timestamp} showText={false} language={language} theme={theme} />
                </TimeStampContent>
              </ListItemView>}
          </Description>
          <ReadMoreWrapper language={language}>
            <ReadMore theme={theme} isTunews={isTunews} onPress={navigateToNews}>{`${t('readMore')}`}</ReadMore>
            <Icon theme={theme} isTunews={isTunews} name='keyboard-arrow-right' style={{
            transform: [{
              scaleX: config.hasRTLScript(language) ? -1 : 1
            }]
          }} />
          </ReadMoreWrapper>
        </StyledTouchableOpacity>
      </ListItemWrapper>
    </>;
};

export default NewsListItem;