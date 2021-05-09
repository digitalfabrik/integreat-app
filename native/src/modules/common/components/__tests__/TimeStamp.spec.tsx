import moment from "moment-timezone";
import React from "react";
import { render } from "@testing-library/react-native";
import { TimeStamp } from "../TimeStamp";
import { DateFormatter } from "api-client";
import { lightTheme } from "../../../theme/constants";
describe('TimeStamp', () => {
  const t = input => input;

  it('should display last update text and formatted timestamp', () => {
    const dateFormatter = new DateFormatter('de');
    const language = 'en';
    const lastUpdate = moment.tz('2020-03-20 17:50:00', 'GMT');
    const {
      getByText
    } = render(<TimeStamp formatter={dateFormatter} language={language} theme={lightTheme} lastUpdate={lastUpdate} t={t} />);
    const formattedDate = dateFormatter.format(lastUpdate, {
      format: 'LL'
    });
    expect(getByText(/lastUpdate/)).toBeTruthy();
    expect(getByText(formattedDate)).toBeTruthy();
  });
  it('should display last update text and formatted timestamp explicitly', () => {
    const dateFormatter = new DateFormatter('de');
    const language = 'en';
    const lastUpdate = moment.tz('2020-03-20 17:50:00', 'GMT');
    const {
      getByText
    } = render(<TimeStamp formatter={dateFormatter} language={language} theme={lightTheme} lastUpdate={lastUpdate} t={t} showText={true} />);
    const formattedDate = dateFormatter.format(lastUpdate, {
      format: 'LL'
    });
    expect(getByText(/lastUpdate/)).toBeTruthy();
    expect(getByText(formattedDate)).toBeTruthy();
  });
  it('should only display formatted timestamp', () => {
    const dateFormatter = new DateFormatter('de');
    const language = 'en';
    const lastUpdate = moment.tz('2020-03-20 17:50:00', 'GMT');
    const {
      getByText,
      queryByText
    } = render(<TimeStamp formatter={dateFormatter} language={language} theme={lightTheme} lastUpdate={lastUpdate} t={t} showText={false} />);
    const formattedDate = dateFormatter.format(lastUpdate, {
      format: 'LL'
    });
    expect(queryByText(/lastUpdate/)).toBeNull();
    expect(getByText(formattedDate)).toBeTruthy();
  });
  it('should display formatted timestamp with format provided', () => {
    const dateFormatter = new DateFormatter('de');
    const language = 'en';
    const format = 'LLL';
    const lastUpdate = moment.tz('2020-03-20 17:50:00', 'GMT');
    const {
      getByText
    } = render(<TimeStamp formatter={dateFormatter} language={language} theme={lightTheme} lastUpdate={lastUpdate} t={t} format={format} showText={false} />);
    const formattedDate = dateFormatter.format(lastUpdate, {
      format
    });
    expect(getByText(formattedDate)).toBeTruthy();
  });
});