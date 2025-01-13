import React, { useState } from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '@/utils';
import styles from './style';
import { RouteStatus } from '@/utils/enum/status.enum';
import { CustomModal } from '../modal/modal.component';
import { Text } from '../text/text.component';
import { RouteModal } from '../route-modal/route-modal.component';

type RouteStatusColorsType = {
  [key in RouteStatus]: {
    labelColor: string;
    borderColor: string;
  };
};

const RouteStatusLabels: { [key in RouteStatus]: string } = {
  [RouteStatus.AVAILABLE]: 'Libre',
  [RouteStatus.NEXT_VISIT]: 'Próximo a visitar',
  [RouteStatus.PENDING]: 'Pendiente',
  [RouteStatus.VISITED]: 'Visitado',
};

const Select = ({ defaultValue = RouteStatus.AVAILABLE, editable = true }: { defaultValue?: RouteStatus; editable?: boolean }) => {
  const [selectedValue, setSelectedValue] = useState<RouteStatus>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState<RouteStatus | null>(null);

  const RouteStatusColors: RouteStatusColorsType = {
    [RouteStatus.AVAILABLE]: {
      labelColor: Colors.GRAY,
      borderColor: Colors.GRAY,
    },
    [RouteStatus.NEXT_VISIT]: {
      labelColor: Colors.SKY_BLUE,
      borderColor: Colors.SKY_BLUE,
    },
    [RouteStatus.PENDING]: {
      labelColor: Colors.RED,
      borderColor: Colors.RED,
    },
    [RouteStatus.VISITED]: {
      labelColor: Colors.GREEN,
      borderColor: Colors.GREEN,
    },
  };

  const currentColor = RouteStatusColors[selectedValue];

  const handleValueChange = (newValue: RouteStatus) => {
    if (newValue !== selectedValue) {
      setTempValue(newValue);
      setIsOpen(true);
    }
  };

  const handleConfirm = () => {
    if (tempValue !== null) {
      setSelectedValue(tempValue);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempValue(null);
    setIsOpen(false);
  };

  return (
    <>
      <View style={[styles.pickerContainer, { borderColor: currentColor.borderColor }]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={handleValueChange}
          style={[styles.picker, { color: currentColor.labelColor }]}
          mode="dropdown"
          dropdownIconColor={currentColor.labelColor}
          dropdownIconRippleColor={Colors.GRAY}
          enabled={editable}
        >
          {Object.keys(RouteStatus).map((key) => {
            const status = RouteStatus[key as keyof typeof RouteStatus];
            return <Picker.Item key={status} label={RouteStatusLabels[status]} value={status} />;
          })}
        </Picker>
      </View>

      {isOpen && selectedValue !== RouteStatus.PENDING && (
        <CustomModal
          isVisible={isOpen}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          content={<Text>¿Desea cambiar el estado a {RouteStatusLabels[tempValue!]}?</Text>}
          title="Confirmar cambio de estado"
        />
      )}

      {isOpen && tempValue === RouteStatus.PENDING && (
        <RouteModal isVisible={isOpen} onClose={() => setIsOpen(false)} onSubmit={() => {}} />
      )}
    </>
  );
};

export default Select;
