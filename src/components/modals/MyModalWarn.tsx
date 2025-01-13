import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { Colors } from '../../utils/constants/Colors';

interface IMyModalWarn {
  title: string;
  // content: string;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onPressConfirm: () => void;
  // titleButtonConfirm: string;
}

const MyModalWarn: React.FC<IMyModalWarn> = ({
  title,
  modalVisible,
  setModalVisible,
  onPressConfirm,
}) => {
  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.containerContentTitle}>
              <MaterialIcons
                name="error-outline"
                size={32}
                color={Colors.white}
              />
              <View style={styles.containerTitle}>
                <Text style={styles.title}>{title}</Text>
              </View>
            </View>

            <View style={styles.containerButtons}>
              <TouchableOpacity onPress={handleCancel}>
                <Ionicons name="close" size={24} color={Colors.white} />
              </TouchableOpacity>

              <TouchableOpacity onPress={onPressConfirm}>
                <Ionicons
                  name="checkmark-sharp"
                  size={24}
                  color={Colors.white}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparente background
  },
  modalView: {
    alignItems: 'center',
    gap: 20,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.blue,
    width: 319,
    backgroundColor: Colors.blue,
  },

  containerContentTitle: {
    gap: 8,
    alignItems: 'center',
  },

  containerTitle: {
    gap: 4,
    width: 272,
  },

  title: {
    height: 38,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 18.75,
    textAlign: 'center',
    color: Colors.white,
  },

  containerButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default MyModalWarn;
