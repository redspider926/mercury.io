import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Text from '../Text';
import Icon from '../Icon';
import {TextInputMask} from 'react-native-masked-text';

import * as images from '@config/images';
import * as size from '@config/size';
import * as color from '@config/color';

const Index = (props) => {
  const [focus, setFocus] = React.useState(false);
  const {phone, name, email, group, value, onChangeText, placeholder} = props;
  return (
    <View style={[styles.root, focus ? styles.onFocus : styles.onBlur]}>
      <View
        style={[
          styles.iconContainer,
          focus
            ? {backgroundColor: color.focus}
            : {backgroundColor: color.darkGray},
        ]}>
        {phone && (
          <>
            <Icon source={images.icons.phone} tintColor={color.white} />
            <Text fontSize={size.font.xs} fontColor={color.white}>
              Phone
            </Text>
          </>
        )}
        {name && (
          <>
            <Icon source={images.icons.profile} tintColor={color.white} />
            <Text fontSize={size.font.xs} fontColor={color.white}>
              Name
            </Text>
          </>
        )}
        {email && (
          <>
            <Icon source={images.icons.email} tintColor={color.white} />
            <Text fontSize={size.font.xs} fontColor={color.white}>
              Email
            </Text>
          </>
        )}
        {group && (
          <>
            <Icon source={images.icons.group} tintColor={color.white} />
            <Text fontSize={size.font.xs} fontColor={color.white}>
              Name
            </Text>
          </>
        )}
      </View>

      {phone ? (
        <TextInputMask
          style={styles.input}
          type="cel-phone"
          placeholderTextColor="#888888"
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          onFocus={(state) => {
            setFocus(true);
          }}
          onBlur={() => {
            setFocus(false);
          }}
          options={
            phone && {
              withDDD: true,
              dddMask: '+9 999-999-9999',
            }
          }
        />
      ) : (
        <TextInput
          style={styles.input}
          placeholderTextColor="#888888"
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          onFocus={(state) => {
            setFocus(true);
          }}
          onBlur={() => {
            setFocus(false);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: size.dimension.Input.height,
    borderRadius: size.dimension.Input.borderRadius,
    borderWidth: size.dimension.screen.hairLine,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
  },

  input: {
    flex: 1,
  },

  onFocus: {
    borderColor: color.focus,
    borderWidth: 1,
  },

  onBlur: {
    borderColor: color.darkGray,
  },

  iconContainer: {
    width: 90,
    height: 30,
    borderRadius: 15,
    backgroundColor: color.focus,
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default Index;
