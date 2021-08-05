import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Header, Input, Avatar, Button, Chat, Contact, Space} from '@components';

import Toast from 'react-native-toast-message';

import * as images from '@config/images';
import * as size from '@config/size';
import * as color from '@config/color';

const Index = (props) => {
  const [phone, setPhone] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  return (
    <View style={styles.root}>
      <Toast style={{zIndex: 10000}} ref={(ref) => Toast.setRef(ref)} />
      <Header title="Test Screen" />
      <ScrollView style={styles.body}>
        <Input
          phone
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
          }}
        />

        <Space height={10} />

        <Input
          name
          value={name}
          onChangeText={(text) => {
            setName(text);
          }}
        />
        <Space height={10} />

        <Input
          email
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />

        <Space height={40} />
        <Avatar />

        <Space height={40} />
        <Button
          title="Test"
          onPress={() => {
            Toast.show({
              type: 'success',
              position: 'bottom',
              text1: 'Hello Sir',
              text2: 'Friend was successfully added to your contact!',
            });
          }}
        />

        <Space height={40} />
        <Contact state="sentInvitation" />
        <Contact state="gotInvitation" />
        <Contact state="accepted" />

        <Space height={40} />
        <Chat notification="1" />
        <Chat
          name="RedSpider"
          finalMessage="I will finish the project."
          notification={14}
        />

        <Space height={40} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },

  body: {
    flexGrow: 1,
    padding: size.dimension.screen.padding,
  },
});

export default Index;
