import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Text from '../Text';
import Icon from '../Icon';

import * as images from '@config/images';
import * as color from '@config/color';
import * as size from '@config/size';

import {
  AuthActions,
  ContactActions,
  NetworkActions,
  ChatActions,
} from '@actions';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const Index = (props) => {
  const {
    avatar,
    name = 'Unknown user',
    phone = '+1 650 555 1234',
    state,
    onAcceptButton = () => {},
    onRejectButton = () => {},
    onChatButton = () => {},
    selected,
    toggleItem,
    onSelect,
    // state = 'sentInvitation',
    // state = 'sentInvitation' | 'gotInvitation' | 'accepted',
  } = props;
  return (
    <TouchableOpacity
      style={styles.root}
      onPress={() => {
        if (toggleItem) {
          onSelect();
          //can select and unselect
        } else {
          //view profile of friend.
        }
      }}>
      <View style={styles.avatarView}>
        <Image
          style={styles.avatar}
          source={avatar === undefined ? images.images.avatar : {uri: avatar}}
        />
      </View>

      <View style={styles.infoView}>
        <Text fontSize={size.font.m}>{name}</Text>
        <Text fontSize={size.font.xs} fontColor={color.darkGray}>
          {phone}
        </Text>
      </View>
      <View>
        {state === '00' && (
          <View style={styles.rightView}>
            <Text fontSize={size.font.xs}>Rejected</Text>
          </View>
        )}
        {state === '01' && (
          <View style={styles.rightView}>
            <Text fontSize={size.font.xs}>Pending...</Text>
          </View>
        )}
        {state === '10' && (
          <View style={styles.rightView}>
            <TouchableOpacity
              style={[
                styles.rejectButton,
                props.network.isOnlne === false && {
                  backgroundColor: color.darkGray,
                },
              ]}
              onPress={onRejectButton}
              disabled={props.network.isOnlne === false}>
              <Text fontSize={size.font.xs} fontColor={color.white}>
                Reject
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.acceptButton,
                props.network.isOnlne === false && {
                  backgroundColor: color.darkGray,
                },
              ]}
              onPress={onAcceptButton}
              disabled={props.network.isOnlne === false}>
              <Text fontSize={size.font.xs} fontColor={color.white}>
                Accept
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {state === '11' && (
          <View style={styles.rightView}>
            <TouchableOpacity style={styles.chatButton} onPress={onChatButton}>
              <Icon source={images.icons.chat} tintColor={color.white} />
            </TouchableOpacity>
          </View>
        )}
        {selected && (
          <View style={styles.rightView}>
            <View style={styles.selected}>
              <Icon source={images.icons.check} tintColor={color.white} />
            </View>
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
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },

  acceptButton: {
    width: 60,
    height: 30,
    borderRadius: 15,
    backgroundColor: color.third,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  rejectButton: {
    width: 60,
    height: 30,
    borderRadius: 15,
    backgroundColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  chatButton: {
    width: 25,
    height: 25,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.primary,
  },

  selected: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.primary,
  },
});

const mapStateToProps = (state) => {
  return {
    network: state.network,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
    contactActions: bindActionCreators(ContactActions, dispatch),
    networkActions: bindActionCreators(NetworkActions, dispatch),
    chatActions: bindActionCreators(ChatActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
