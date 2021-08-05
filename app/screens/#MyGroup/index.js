import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Header, Text, Icon, Space, Button} from '@components';

import Toast from 'react-native-toast-message';

import * as images from '@config/images';
import * as size from '@config/size';
import * as color from '@config/color';

import database from '@react-native-firebase/database';

import {AuthActions} from '@actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const Index = (props) => {
  const groups = Object.values(props.chats).filter(
    (chat) => chat.type === 'GROUP',
  );

  return (
    <View style={styles.root}>
      <Header title="My Groups" navigation={props.navigation} leftButton />
      <View style={styles.body}>
        <FlatList
          style={styles.flatList}
          columnWrapperStyle={{
            justifyContent: 'flex-start',
          }}
          data={groups}
          numColumns={3}
          keyExtractor={(item, index) => 'id' + index}
          renderItem={(item) => (
            <TouchableOpacity
              style={styles.group}
              onPress={() =>
                props.navigation.navigate('EditGroupScreen', {
                  users: Object.keys(item.item.users),
                  users_: item.item.users,
                  name: item.item.name,
                  chatId: item.item.chatId,
                })
              }>
              <Image source={{uri: item.item.avatar}} style={styles.avatar} />
              <Text fontSize={size.font.xs} textAlign="center">
                {item.item.name}
              </Text>
              <View style={styles.usersInfo}>
                <Icon source={images.icons.group} tintColor={color.primary} />
                <Space width={10} />
                <Text fontSize={size.font.xs} fontColor={color.darkGray}>
                  {Object.values(item.item.users).length}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={[
            styles.addGroup,
            props.network.isOnline === false && {
              backgroundColor: color.darkGray,
            },
          ]}
          disabled={props.network.isOnline === false}
          onPress={() => props.navigation.navigate('NewGroupScreen')}>
          <Icon
            source={images.icons.addGroup}
            tintColor={color.white}
            size={30}
          />
        </TouchableOpacity>
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
    paddingTop: size.dimension.screen.padding,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: color.black,
  },

  group: {
    width:
      (size.dimension.screen.width - size.dimension.screen.padding * 4) / 3,
    marginLeft: size.dimension.screen.padding,
    marginBottom: size.dimension.screen.padding,
    alignItems: 'center',
    // justifyContent: 'center',
  },

  usersInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addGroup: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    bottom: 20,
    right: 20,
    backgroundColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => {
  return {auth: state.auth, chats: state.chats, network: state.network};
};

const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
