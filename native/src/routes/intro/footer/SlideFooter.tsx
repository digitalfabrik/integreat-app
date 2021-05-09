import * as React from "react";
import SlideButton from "./SlideButton";
import Pagination from "./Pagination";
import styled from "styled-components/native";
import type { StyledComponent } from "styled-components";
import "styled-components";
import type { ThemeType } from "build-configs/ThemeType";
import type { TFunction } from "react-i18next";
import { View } from "react-native";
export const ButtonContainer: StyledComponent<{}, ThemeType, any> = styled.View`
  flex-grow: 1;
  flex-direction: row;
  padding: 5px;
  background-color: ${props => props.theme.colors.backgroundColor};
`;
type PropsType = {
  slideCount: number;
  currentSlide: number;
  goToSlide: (index: number) => void;
  onDone: () => Promise<void>;
  theme: ThemeType;
  t: TFunction;
};

const SlideFooter = ({
  onDone,
  theme,
  slideCount,
  goToSlide,
  currentSlide,
  t
}: PropsType) => {
  const goToNextSlide = () => goToSlide(currentSlide + 1);

  const isLastSlide = currentSlide === slideCount - 1;
  return <View>
      <ButtonContainer>
        {!isLastSlide && <SlideButton label={t('skip')} onPress={onDone} theme={theme} />}
        <SlideButton label={t('next')} onPress={isLastSlide ? onDone : goToNextSlide} theme={theme} />
      </ButtonContainer>
      <Pagination slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} />
    </View>;
};

export default SlideFooter;