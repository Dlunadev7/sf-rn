import React from 'react';
import { Button } from './button.component';
import { StyleSheet } from 'react-native';
import { ButtonType } from '@/utils/types/button.type';
import { Row } from '../layout/row/row.component';
import { Check } from '../../../../assets/svg';
import { Colors } from '@/utils';

interface SaveCancelButtonsProps {
  onCancel: () => void;
  onSave: () => void;
  loading: boolean;
}

export const SaveCancelButtons = ({ onCancel, onSave, loading }: SaveCancelButtonsProps) => {
  return (
    <Row alignItems="center" justifyContent="space-between" gap={8} style={styles.button_group}>
      <Button onPress={onCancel} type={ButtonType.TEXT}>
        Cancelar
      </Button>
      <Button loading={loading} onPress={onSave} rightIcon={<Check width={16} color={Colors.white} />}>
        Guardar
      </Button>
    </Row>
  );
};

const styles = StyleSheet.create({
  button_group: {
    width: '100%',
    marginTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 12,
  },
});
