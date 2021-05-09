import React from "react";
import { LocalNewsModel } from "api-client";
import moment from "moment";
import { shallow } from "enzyme";
import LocalNewsList from "../LocalNewsList";
import NewsListItem from "../NewsListItem";
import { LOCAL_NEWS } from "../../constants";
import DateFormatter from "api-client/src/i18n/DateFormatter";
describe('LocalNewsList', () => {
  const language = 'en';
  const link = '/testumgebung/en/news/local';

  const t = (key: string | null | undefined): string => key || '';

  const city = 'testcity';

  const renderItem = ({
    id,
    title,
    message,
    timestamp
  }, city) => <NewsListItem title={title} content={message} timestamp={timestamp} type={LOCAL_NEWS} key={localNews1.id} link={link} t={t} formatter={new DateFormatter(language)} />;

  const date = moment('2017-11-18T09:30:00.000Z');
  const localNews1 = new LocalNewsModel({
    id: 217,
    title: 'Important',
    timestamp: date,
    message: 'This is a very important message from your favourite city!'
  });
  const localNews2 = new LocalNewsModel({
    id: 218,
    title: 'Love :)',
    timestamp: date,
    message: 'I am a random local news content content and I like it!!!!!!!!!'
  });
  const items = [localNews1, localNews2];
  it('should have two NewsListItem', () => {
    const localNewsList = shallow(<LocalNewsList items={items} renderItem={renderItem} city={city} noItemsMessage='no item' />).dive();
    const newsElementList = localNewsList.find('NewsListItem');
    expect(newsElementList).toHaveLength(2);
    expect(newsElementList.find({
      title: 'Love :)'
    })).toHaveLength(1);
  });
  it('should render "noItemsMessage" if the items is an empty array', () => {
    const localNewsList = shallow(<LocalNewsList items={[]} renderItem={renderItem} city={city} noItemsMessage='No items' />).dive();
    const noItemsMessage = localNewsList.text();
    expect(noItemsMessage).toEqual('No items');
  });
});