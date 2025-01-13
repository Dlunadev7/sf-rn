import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { useAuthStore } from '@/zustand/auth/auth.store'; // Mantén el estado de autenticación

const useFileDownloader = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>(''); // Mensaje informativo
  const token = useAuthStore((state) => state.token);

  const downloadFromAPI = async (url: string, filename: string, extension: string) => {
    try {
      setIsDownloading(true);
      setStatusMessage('Descargando...'); // Mensaje en progreso
      const file = `${filename}.${extension}`;
      const result = await FileSystem.downloadAsync(url, FileSystem.documentDirectory + file, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/pdf',
        },
      });

      console.log(result);
      setStatusMessage('Descarga completada con éxito. Guardando archivo...');
      await save(result.uri, file, result.headers['Content-Type']);
    } catch (error) {
      setIsDownloading(false);
      setStatusMessage('Error en la descarga. Intentando de nuevo...');
      setErrorMessage('Hubo un problema descargando el archivo desde la API.');
      console.error(error);
    }
  };

  const save = async (uri: string, filename: string, mimetype: string) => {
    try {
      if (Platform.OS === 'android') {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
          await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
            .then(async (uri) => {
              await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
              setIsDownloading(false);
              setStatusMessage('Archivo guardado exitosamente.');
            })
            .catch((e) => {
              setIsDownloading(false);
              setStatusMessage('Error al guardar el archivo.');
              setErrorMessage('Error al guardar el archivo.');
              console.log(e);
            });
        } else {
          setIsDownloading(false);
          setStatusMessage('Permisos denegados, compartiendo archivo...');
          shareAsync(uri);
        }
      } else {
        setStatusMessage('Guardando archivo...');
        shareAsync(uri);
      }
    } catch (error) {
      setIsDownloading(false);
      setStatusMessage('Error al guardar el archivo.');
      setErrorMessage('No se pudo guardar el archivo.');
      console.error('Error al guardar el archivo:', error);
    }
  };

  const shareAsync = async (uri: string) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        setStatusMessage('Compartiendo archivo...');
        await Sharing.shareAsync(uri);
        setStatusMessage('Archivo compartido con éxito.');
      } else {
        setErrorMessage('No se puede compartir el archivo en este dispositivo.');
        setStatusMessage('No se puede compartir el archivo en este dispositivo.');
      }
    } catch (error) {
      setIsDownloading(false);
      setStatusMessage('Error al intentar compartir el archivo.');
      setErrorMessage('No se pudo compartir el archivo.');
      console.error('Error al intentar compartir el archivo:', error);
    }
  };

  return {
    isDownloading,
    errorMessage,
    statusMessage, // Agregar el estado de mensaje
    downloadFromAPI,
  };
};

export default useFileDownloader;
