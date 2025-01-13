import { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';

type UseBarcodeScannerHook = {
  hasPermission: boolean | null;
  scanned: boolean;
  handleBarCodeScanned: (data: string) => void;
  resetScanner: () => void;
};

export const useBarcodeScanner = (): UseBarcodeScannerHook => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermission();
  }, []);

  const handleBarCodeScanned = (data: string) => {
    setScanned(true);
    alert(`Bar code data ${data} has been scanned!`);
  };

  const resetScanner = () => {
    setScanned(false);
  };

  return { hasPermission, scanned, handleBarCodeScanned, resetScanner };
};
