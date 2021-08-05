import React from 'react';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';

const Index = (props) => {
  const {children} = props;
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default Index;
