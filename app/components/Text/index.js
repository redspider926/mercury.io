import React from 'react';
import {Text} from 'react-native';
import * as color from '@config/color';
import * as size from '@config/size';

const Index = (props) => {
  const {
    children,
    fontColor = color.black,
    fontSize = size.font.m,
    textAlign = 'left',
  } = props;
  return (
    <Text style={{color: fontColor, fontSize: fontSize, textAlign: textAlign}}>
      {children}
    </Text>
  );
};

export default Index;
