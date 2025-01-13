import { Colors, scaleSize } from '@/utils';
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import { ArrowDown, ArrowUp, Cross } from '../../../../assets/svg';
import { Row } from '../layout/row/row.component';
import { Text } from '../text/text.component';

interface AccordionProps {
  title?: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  onDelete?: () => void;
  height: number;
  error?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  title = 'Matricula',
  children,
  isOpen = false,
  onToggle,
  onDelete,
  height = 350,
  error,
}) => {
  const [open, setOpen] = useState(isOpen);
  const [heightAnim] = useState(new Animated.Value(0));

  const toggleAccordion = useCallback(() => {
    const newState = !open;
    setOpen(newState);

    Animated.timing(heightAnim, {
      toValue: newState ? scaleSize(height) : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (onToggle) {
      onToggle(newState);
    }
  }, [open, heightAnim, height, onToggle]);

  React.useEffect(() => {
    if (isOpen !== open) {
      setOpen(isOpen);
      Animated.timing(heightAnim, {
        toValue: isOpen ? 1000 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isOpen, open, heightAnim]);

  return (
    <View style={styles.accordionContainer}>
      <Pressable onPress={toggleAccordion} style={[styles.titleContainer, error ? styles.error : {}]}>
        <Row alignItems="center" justifyContent="space-between">
          <Row alignItems="center">
            <Pressable onPress={onDelete}>
              <Cross color={error ? Colors.white : Colors.black} width={24} height={24} />
            </Pressable>
            <Text fontSize={16} fontWeight={600} style={error ? styles.title_error : {}}>
              {title || 'Matricula'}
            </Text>
          </Row>
          <Pressable onPress={toggleAccordion}>
            {open ? (
              <ArrowUp color={error ? Colors.white : Colors.black} width={24} height={24} />
            ) : (
              <ArrowDown color={error ? Colors.white : Colors.black} width={24} height={24} />
            )}
          </Pressable>
        </Row>
      </Pressable>
      <Animated.View style={[styles.contentContainer, { height: heightAnim }]}>
        <View>{children}</View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  accordionContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    borderRadius: 8,
  },
  titleContainer: {
    padding: 10,
    backgroundColor: Colors.LIGHT_GREY,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    overflow: 'hidden',
    paddingHorizontal: 12,
    backgroundColor: Colors.LIGHT_GREY,
  },
  error: {
    backgroundColor: Colors.error,
  },
  title_error: {
    color: Colors.white,
  },
});
