import {Dimensions, StyleSheet} from 'react-native';
export const font = {
  font1: 14,
  font2: 18,
  font3: 22,
  font4: 40,
  font5: 50,
  xs: 14,
  s: 16,
  m: 18,
  l: 20,
  xl: 22,
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const screenPadding = 20;
const commonComponentHeight = 40;
const commonComponentBorderRadius = 5;
const hairLine = StyleSheet.hairlineWidth;

export const dimension = {
  screen: {
    width: screenWidth,
    height: screenHeight,
    padding: screenPadding,
    hairLine: hairLine,
  },

  Button: {
    height: commonComponentHeight,
    borderRadius: commonComponentHeight,
  },

  Input: {
    height: commonComponentHeight,
    borderRadius: commonComponentHeight,
  },

  Header: {
    height: commonComponentHeight,
  },

  Friend: {
    height: commonComponentHeight,
    borderRadius: 10,
    padding: 10,
  },

  Chat: {
    height: 70,
    borderRadius: 10,
    padding: 10,
  },

  CodeCell: {
    width: (screenWidth - screenPadding * 2 - 100) / 6,
    height: (screenWidth - screenPadding * 2 - 100) / 6,
    lineHeight: 38,
    underlineBorderWidth: 2,
  },

  customButton: {
    width: '100%',
    height: 50,
    borderRadius: 10,
  },
  phoneNumberInput: {
    width: '100%',
    height: 50,
    borderRadius: 10,
  },
  verificationCode: {
    width: (screenWidth - screenPadding * 2 - 100) / 6,
    height: (screenWidth - screenPadding * 2 - 100) / 6,
  },
  phoneNumberButton: {
    width: (screenWidth - screenPadding * 2 - 40) / 3,
    // height: (screenWidth - screenPadding * 2 - 100) / 6,
  },
  size1: 10,
  size2: 20,
  size3: 30,
  size4: 40,
  size_normal: 40,
  size_header: 50,
  padding: 16,
};
