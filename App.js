import React, { Component } from 'react';
import { Text, View, StyleSheet, Image,StatusBar } from 'react-native';
import { Constants } from 'expo';

// You can import from local files
import styled from 'styled-components';

// or any pure javascript modules available in npm
import { Card, Header } from 'react-native-elements'; // Version can be specified in package.json

export default class App extends Component {
  render() {
    return (
      <View>
         <StatusBar
     backgroundColor="blue"
     barStyle="light-content"
   />
        <BoxShadow>
          <Image style={styles.logo} source={require('./assets/logo.png')} />
          <Text>A</Text>
        </BoxShadow>
        <BoxShadow />
      </View>
    );
  }
}

const BoxShadow = styled.View`
  elevation: 1;
  background-color: #fafafa;
  height: 55;
`;

const styles = StyleSheet.create({
  logo: {
    marginTop: -20,
    height: 128,
    width: 150,
    resizeMode: 'contain',
  },
});
