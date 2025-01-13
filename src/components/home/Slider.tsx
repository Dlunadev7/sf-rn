import { View, FlatList, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { Colors } from '@/utils/constants/Colors';
import { Fontisto } from '@expo/vector-icons';

const slides = [
  { key: '1', title: 'Nombre de la empresa', date: '24/09/2024' },
  { key: '2', title: 'Nombre de la empresa', date: '24/09/2024' },
  { key: '3', title: 'Nombre de la empresa', date: '24/09/2024' },
];

const Slider = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recordatorios</Text>

      <FlatList
        contentContainerStyle={styles.containerSlider}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.containerImage}>
              <Image src={''} style={styles.image} />
            </View>

            <View style={styles.containerTextArrow}>
              <View style={styles.containerTexts}>
                <Text style={styles.text1}>{item.title}</Text>
                <Text style={styles.text2}>{item.date}</Text>
              </View>

              <TouchableOpacity style={styles.buttonArrow}>
                <Fontisto name="arrow-right-l" size={24} color={Colors.blue} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    gap: 24,
    paddingLeft: 12,
  },

  containerSlider: {
    gap: 24,
    paddingVertical: 24,
  },

  slide: {
    borderRadius: 12,
    gap: 6.88,
    width: 167.34,
    shadowColor: '#000000',
    shadowOffset: { width: 2.58, height: 4.3 },
    shadowOpacity: 0.3,
    shadowRadius: 8.6,
    elevation: 5,
    backgroundColor: Colors.blue,
  },

  title: {
    height: 19,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 18.75,
    color: Colors.text,
  },

  containerImage: {
    padding: 10,
  },
  image: {
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    height: 80,
    width: 80,
    objectFit: 'cover',
    backgroundColor: '#fff',
  },

  containerTextArrow: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  containerTexts: {
    gap: 8.6,
    alignItems: 'flex-start',
  },
  text1: {
    height: 16,
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 16.41,
    textAlign: 'center',
    color: Colors.white,
  },
  text2: {
    height: 12,
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 14.06,
    textAlign: 'center',
    color: Colors.white,
  },
  buttonArrow: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderRadius: 999,
    height: 30,
    width: 30,
    backgroundColor: Colors.white,
  },
});
