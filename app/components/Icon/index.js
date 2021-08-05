import React from 'react';
import {Image} from 'react-native';

const Index = (props) => {
  const {tintColor, source, size = 15} = props;
  return (
    <>
      <Image
        style={{tintColor: tintColor, width: size, height: size}}
        source={source}
      />
    </>
  );
};

export default Index;
