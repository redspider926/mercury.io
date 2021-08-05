import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '../Icon';
import Modal from 'react-native-modal';

import * as images from '@config/images';
import * as color from '@config/color';

const Index = (props) => {
  const {source, onCameraButton, onImageButton} = props;
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  return (
    <TouchableOpacity
      style={styles.root}
      onPress={() => setIsModalVisible(true)}>
      <Image
        style={styles.image}
        source={source === '' ? images.images.avatar : {uri: source}}
      />
      <View style={styles.editContainer}>
        <Icon source={images.icons.edit} tintColor={color.white} />
      </View>
      <Modal
        useNativeDriverForBackdrop
        // propagateSwipe
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.modalItem} onPress={onCameraButton}>
            <Icon
              source={images.icons.camera}
              size={30}
              tintColor={color.white}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem} onPress={onImageButton}>
            <Icon
              source={images.icons.image}
              size={30}
              tintColor={color.white}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  editContainer: {
    position: 'absolute',
    bottom: -15,
    // right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: color.white,
    borderWidth: 2,
    elevation: 2,
  },

  modal: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: color.white,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },

  modalItem: {
    width: 50,
    height: 50,
    margin: 10,
    borderRadius: 10,
    backgroundColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Index;
