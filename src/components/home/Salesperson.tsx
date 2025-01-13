import { Colors } from '@/utils/constants/Colors';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Salesperson = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>Nombre Vendedor</Text>

      <Image style={styles.image} />
    </View>
  );
};

export default Salesperson;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 54,
  },

  name: {
    height: 14,
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 14.06,
    color: Colors.text,
  },

  image: {
    borderRadius: 999,
    height: 40,
    width: 40,
    backgroundColor: '#c5c5c5',
  },
});
