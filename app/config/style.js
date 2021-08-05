import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },

  shadow: {
    shadowColor: '#00f',
    shadowOffset: {
      width: 100,
      height: 0,
    },
    shadowOpacity: 0.25,
    // shadowRadius: 3.84,

    elevation: 10,
  },

  backButton: {
    position: 'absolute',
    left: 16,
  },
});
