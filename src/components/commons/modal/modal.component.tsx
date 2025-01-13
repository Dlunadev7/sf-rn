import React from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { Column } from '../layout/column/column.component';
import { Text } from '../text/text.component';
import { Button } from '../button/button.component';
import { ButtonType } from '@/utils/types/button.type';
import styles from './modal.style';
import { Row } from '../layout/row/row.component';
import { ArrowLeftFilled } from '../../../../assets/svg';
import { Colors } from '@/utils';

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  content?: React.ReactNode;
  onConfirm?: () => void;
}

export const CustomModal = (props: CustomModalProps) => {
  const { isVisible, onClose, title, content, onConfirm } = props;
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal} useNativeDriver animationIn="fadeIn" animationOut="fadeOut">
      <Column gap={12} style={styles.modalContent}>
        {title && (
          <Text fontSize={20} fontWeight={500}>
            {title}
          </Text>
        )}
        {content}
        {onConfirm ? (
          <View style={styles.buttonContainer}>
            <Button onPress={onClose} type={ButtonType.TEXT} leftIcon={<ArrowLeftFilled color={Colors.black} />}>
              Volver
            </Button>
            <Button onPress={onConfirm} type={ButtonType.FILLED}>
              Aceptar
            </Button>
          </View>
        ) : (
          <Row justifyContent="center" alignItems="center" style={styles.button_container}>
            <Button onPress={onClose} type={ButtonType.FILLED}>
              Aceptar
            </Button>
          </Row>
        )}
      </Column>
    </Modal>
  );
};
