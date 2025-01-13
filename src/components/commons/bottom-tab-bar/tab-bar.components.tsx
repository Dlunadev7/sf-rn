import React, { useMemo } from 'react';
import { View } from 'react-native';
import TabBarButton from './tab-bar-buttons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import styles from './style';

interface TabBarStyle {
  display?: string;
}

interface RouteOptions {
  tabBarStyle?: TabBarStyle;
}

interface RouteDescriptor {
  options: RouteOptions;
}

const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const primaryColor = '#0891b2';
  const greyColor = '#737373';

  const isTabBarVisible = useMemo(() => {
    return state.routes
      .map((route) => {
        const {
          options: { tabBarStyle },
        } = (descriptors[route.key] as RouteDescriptor) || {};
        return tabBarStyle?.display;
      })
      .some((style) => style === 'none');
  }, [state.routes, descriptors]);

  if (isTabBarVisible) {
    return null;
  }

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

        if (['_sitemap', '+not-found'].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? primaryColor : greyColor}
            label={label as string}
          />
        );
      })}
    </View>
  );
};

export default TabBar;
