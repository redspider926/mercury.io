import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Text from '../Text';
import Icon from '../Icon';
import Space from '../Space';

import * as images from '@config/images';
import * as color from '@config/color';
import * as size from '@config/size';

const Index = (props) => {
  const {
    avatar,
    name = 'Alex',
    finalMessage = 'Hello.',
    notification = 0,
    onPress = () => {},
    type = 'DIRECT',
  } = props;
  return (
    <TouchableOpacity style={styles.root} onPress={onPress}>
      <View style={styles.avatarView}>
        <Image
          style={styles.avatar}
          source={avatar === undefined ? images.images.avatar : {uri: avatar}}
        />
      </View>

      <View style={styles.infoView}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'center',
          }}>
          <Icon
            source={
              type === 'DIRECT' ? images.icons.profile : images.icons.group
            }
            tintColor={color.black}
            size={15}
          />
          <Space width={10} />
          <Text fontSize={size.font.m}>{name}</Text>
        </View>

        <Text fontSize={size.font.xs} fontColor={color.darkGray}>
          {finalMessage}
        </Text>
      </View>
      <View style={styles.rightView}>
        {notification > 0 && (
          <View style={styles.notification}>
            <Text fontSize={size.font.xs} fontColor={color.white}>
              {notification}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: size.dimension.screen.hairLine,
    // paddingBottom: 5,
    borderColor: color.black,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.black,
  },

  avatarView: {
    height: '100%',
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoView: {
    height: '100%',
    flex: 1,
    justifyContent: 'space-around',
  },

  rightView: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },

  notification: {
    width: 25,
    height: 25,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.focus,
  },
});

export default Index;
