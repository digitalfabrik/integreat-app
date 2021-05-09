import React from "react";
import { shallow } from "enzyme";
import TileModel from "../../../../modules/common/models/TileModel";
import Tiles from "../Tiles";
const tiles = [new TileModel({
  path: '/augsburg/de/willkommen/willkommen-in-augsburg',
  title: 'Willkommen in Augsburg',
  thumbnail: 'some-thumnail.jpg',
  isExternalUrl: false,
  postData: null
}), new TileModel({
  path: '/augsburg/de/willkommen/erste-schritte',
  title: 'Erste Schritte',
  thumbnail: 'some-other-thumbnail.jpg',
  isExternalUrl: false,
  postData: null
})];
describe('Tiles', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(<Tiles tiles={tiles} title='Augsburg' />);
    expect(wrapper).toMatchSnapshot();
  });
});