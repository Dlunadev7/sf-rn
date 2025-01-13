import { Colors, scaleSize } from '@/utils';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  slide_content_container: {
    paddingLeft: 12,
  },
  containerSlider: {
    marginTop: 12,
  },
  slide: {
    borderRadius: scaleSize(12),
    width: scaleSize(317),
    padding: 12,
    paddingVertical: 20,
    marginRight: 24,
  },

  slide_image_container: {
    backgroundColor: Colors.white,
    width: scaleSize(55),
    height: scaleSize(55),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 18.75,
    color: Colors.text,
  },

  slide_item_button: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    alignSelf: 'center',
    paddingHorizontal: 8,
    borderRadius: 100,
    height: scaleSize(32),
    width: scaleSize(65),
    backgroundColor: Colors.white,
    // position: 'absolute',
    // right: Platform.OS === 'ios' ? scaleSize(-80) : scaleSize(-70),
  },
  slide_details: {
    // position: 'relative',
    flex: 2,
    marginTop: 8,
  },
  slide_empty: {
    alignSelf: 'center',
    width: '100%',
  },

  slide_empty_background: {
    backgroundColor: Colors.DARK_GRAY,
    borderRadius: scaleSize(12),
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    padding: 12,
    paddingVertical: 20,
  },
  slide_more: {
    marginRight: 4,
  },
  description_container: {
    flex: 1,
    paddingHorizontal: 12,
    marginRight: 12,
  },
});

export default styles;
