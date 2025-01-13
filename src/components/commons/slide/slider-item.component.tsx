import { DimensionValue, ImageBackground, Pressable, View } from 'react-native';
import React from 'react';
import { ArrowRightLarge, Notification } from '../../../../assets/svg';
import styles from './slider.style';
import { Colors, scaleSize } from '@/utils';
import { Row } from '../layout/row/row.component';
import { Column } from '../layout/column/column.component';
import { Text } from '../text/text.component';
import { router } from 'expo-router';
import { ClientStatus } from '@/utils/enum/status.enum';
import { staticImages } from '../../../../assets/images';
import { truncateText } from '@/helpers/truncate-text.helper';

interface SliderItemProps {
  title: string;
  date: string;
  showArrow?: boolean;
  width?: DimensionValue;
  status?: ClientStatus;
  description?: string;
}
// const backgroundColors: Record<ClientStatus, string> = {
//   [ClientStatus.POTENTIAL]: Colors.LIGHT_BLUE,
//   [ClientStatus.FRECUENT]: Colors.YELLOW,
//   [ClientStatus.UNSUBSCRIBED]: Colors.GREEN,
//   [ClientStatus.COMPETENCE]: '',
//   [ClientStatus.COMPETENCE_FRECUENT]: '',
// };

export default function SliderItem({
  title,
  date,
  showArrow = true,
  width,
  status = ClientStatus.POTENTIAL,
  description,
}: SliderItemProps) {
  return (
    <ImageBackground
      source={staticImages.REMINDER_BACKGROUND}
      style={[styles.slide, { width: width ? width : scaleSize(317) }]}
      borderRadius={12}
    >
      <Row alignItems="flex-start">
        <View style={styles.slide_image_container}>
          <Notification />
        </View>

        <View style={styles.description_container}>
          <Column alignItems="flex-start" gap={scaleSize(8)}>
            <Text fontSize={14} fontWeight={600} textColor={Colors.white}>
              {title}
            </Text>
            <Text fontSize={12} fontWeight={500} textColor={Colors.white}>
              {date}
            </Text>
          </Column>

          <Row justifyContent="space-between" alignItems="center" style={{ width: '100%' }}>
            <Text fontSize={12} textColor={Colors.white}>
              {description}
            </Text>
            {showArrow && (
              <Pressable onPress={() => router.push('/reminders')} style={styles.slide_item_button}>
                <ArrowRightLarge color={Colors.blue} />
              </Pressable>
            )}
          </Row>
        </View>
      </Row>
    </ImageBackground>
  );
}
