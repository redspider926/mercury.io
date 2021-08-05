import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Header, Text, Avatar, Input, Button, Space, Icon} from '@components';

import Toast from 'react-native-toast-message';

import * as images from '@config/images';
import * as size from '@config/size';
import * as color from '@config/color';

const Index = (props) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  return (
    <View style={styles.root}>
      <Header title="Prfoile" />
      <View style={styles.body}>
        <Image source={images.images.avatar} style={styles.avatar} />
        <Space height={30} />
        <View style={styles.profileInfo}>
          <View style={styles.profileItem}>
            <Icon source={images.icons.phone} tintColor={color.priamry} />
            <Space width={10} />
            <Text fontSize={size.font.s}>+1 650 555 1234</Text>
          </View>
          <View style={styles.profileItem}>
            <Icon source={images.icons.profile} tintColor={color.priamry} />
            <Space width={10} />
            <Text fontSize={size.font.s}>Alex Hall</Text>
          </View>
          <View style={styles.profileItem}>
            <Icon source={images.icons.email} tintColor={color.priamry} />
            <Space width={10} />
            <Text fontSize={size.font.s}>alex@gmail.com</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },

  body: {
    flex: 1,
    padding: size.dimension.screen.padding,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },

  profileInfo: {
    borderWidth: size.dimension.screen.hairLine,
    borderColor: color.darkGray,
    borderRadius: 20,
    height: 150,
    justifyContent: 'space-between',
    padding: 20,
  },

  profileItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Index;
