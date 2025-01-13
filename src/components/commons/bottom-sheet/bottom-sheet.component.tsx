import React, { useRef, useEffect, ReactElement, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import GBottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import styles from './style';
import { useNavigation } from 'expo-router';
import { Text } from '../text/text.component';

interface BottomSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  content: ReactElement | ReactElement[];
  title?: string;
  snapPoints?: (string | number)[];
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  setIsOpen,
  content,
  title,
  snapPoints = [StyleSheet.hairlineWidth, '55%', '90%'],
}) => {
  const bottomSheetRef = useRef<GBottomSheet>(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (bottomSheetRef.current) {
      if (isOpen) {
        bottomSheetRef.current.expand();
      } else {
        bottomSheetRef.current.close();
      }
    }
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: isOpen ? 'none' : 'flex' },
    });
  }, [isOpen, navigation]);

  const handleSheetChange = (index: number) => {
    setIsOpen(index > 0);
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} style={styles.backdrop} pressBehavior="close" />
    ),
    [],
  );

  return (
    <GestureHandlerRootView style={styles.gesture_handler_container}>
      <GBottomSheet
        ref={bottomSheetRef}
        index={isOpen ? 1 : -1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={handleSheetChange}
        handleComponent={() => (
          <View style={styles.handle}>
            <Text fontWeight={600}>{title}</Text>
            <View style={styles.drag_line} />
          </View>
        )}
        backdropComponent={renderBackdrop}
      >
        {content}
      </GBottomSheet>
    </GestureHandlerRootView>
  );
};
