import React, { useState } from 'react';
import { Pressable, TextInput as RNTextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/utils';
import { styles } from './input.style';
import { InputProps } from './input.type';
import { Text } from '../text/text.component';

export const TextInput = (props: InputProps) => {
  const {
    secureTextEntry,
    error,
    label,
    editable = true,
    icon,
    leftIcon,
    backgroudDisabled = true,
    styleContainer,
    style,
    container,
  } = props;
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean | undefined>(secureTextEntry);

  const [isFocus, setIsFocus] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View style={[styles.input_container, container]}>
      {label && (
        <Text fontWeight={300} style={[styles.label, error ? { color: Colors.error } : {}]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.input_content_container,
          isFocus && styles.inputFocus,
          !editable && backgroudDisabled && styles.inputDisabled,
          error ? { borderColor: Colors.error } : {},
          styleContainer,
        ]}
      >
        {leftIcon && <Pressable style={styles.left_icon}>{leftIcon}</Pressable>}
        <RNTextInput
          {...props}
          secureTextEntry={isPasswordVisible}
          style={[styles.input, style]}
          placeholderTextColor={error ? Colors.error : Colors.grey}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />

        {icon && <Pressable>{icon}</Pressable>}
        {secureTextEntry && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color={error ? Colors.error : Colors.grey} />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text fontSize={12} fontWeight={300} textColor={Colors.error} style={styles.input_error_message}>
          {error}
        </Text>
      )}
    </View>
  );
};
