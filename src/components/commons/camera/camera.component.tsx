import React, { useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors } from '@/utils';
import { CustomModal } from '../modal/modal.component';

export default function BarCodeScannerComponent({ setCode }: { setCode: (data: string) => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  if (!permission) {
    return <></>;
  }

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setCode(data);
    setScanned(false);
  };

  return (
    <>
      <View style={styles.container}>
        <CameraView onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} style={styles.camera} />
        <View style={styles.scanArea}>
          <View style={styles.line} />
        </View>
      </View>
      <CustomModal
        isVisible={isOpen}
        onClose={() => setIsOpen(false)}
        title="Acceso Denegado"
        content={
          <Text>
            Para poder utilizar la cámara, es necesario que otorgues los permisos correspondientes. Por favor, ve a la configuración de tu
            dispositivo y habilita el acceso a la cámara.
          </Text>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  scanArea: {
    position: 'absolute',
    top: '40%',
    left: '5%',
    width: '90%',
    height: '20%',
    borderWidth: 1,
    borderColor: Colors.GREEN,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  camera: {
    height: 250,
    width: '100%',
  },
  line: {
    width: '98%',
    height: 1,
    backgroundColor: Colors.GREEN,
    paddingHorizontal: 12,
  },
});
