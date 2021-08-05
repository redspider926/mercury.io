import React from 'react';
import {View} from 'react-native';

const Index = (props) => {
  const {width, height, flex} = props;
  return (
    <View
      style={{
        width: width,
        height: height,
        flex: flex,
      }}
    />
  );
};

export default Index;
