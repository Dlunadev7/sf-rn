import { View, Pressable, PressableProps, TextStyle } from 'react-native';
import React from 'react';
import { Home, Clients, Orders, Routes, Products } from '../../../../assets/svg';
import { Colors } from '@/utils';
import styles from './style';
import { ScreenLabel } from '@/utils/enum/screen-label.enum';
import { Text } from '../text/text.component';

interface TabBarButtonProps extends PressableProps {
  label: string;
  color: string;
  isFocused: boolean;
  routeName: string;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({ label, color, isFocused, ...props }) => {
  const icons = {
    [ScreenLabel.Home]: Home,
    [ScreenLabel.Clientes]: Clients,
    [ScreenLabel.Ordenes]: Orders,
    [ScreenLabel.Rutas]: Routes,
    [ScreenLabel.Productos]: Products,
  };

  const renderIcon = () => {
    const iconColor = isFocused ? Colors.RED : Colors.GRAY;
    const IconComponent = icons[label as ScreenLabel] || Home;

    return <IconComponent color={iconColor} />;
  };

  const textStyle: TextStyle = {
    color: isFocused ? Colors.RED : color,
    fontSize: 11,
  };

  return (
    <Pressable {...props} style={styles.container}>
      {label !== 'inicio' && <View>{renderIcon()}</View>}

      {label === 'inicio' ? (
        <View style={styles.homeLabelContainer}>
          <Home color={isFocused ? Colors.RED : Colors.GRAY} />
          <Text style={textStyle} transform="capitalize">
            {label}
          </Text>
        </View>
      ) : (
        <Text style={textStyle} transform="capitalize">
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export default TabBarButton;
