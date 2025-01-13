import { scaleSize, Colors } from '@/utils';
import { View, TouchableOpacity } from 'react-native';
import { ArrowRightLarge } from '../../../../assets/svg';
import { Column } from '../layout/column/column.component';
import { Row } from '../layout/row/row.component';
import styles from './style';
import { SlideItemProps, StatusItem } from './shortcuts.type';
import { Text } from '../text/text.component';

export const Shortcuts = ({ backgroundColor, icon: Icon, title, total, statusList, onPress, width }: SlideItemProps) => {
  return (
    <View style={[styles.shortcuts, { backgroundColor, width }]}>
      <Column>
        <Row gap={scaleSize(12)}>
          <View style={styles.shortcuts_image_container}>
            <Icon color={backgroundColor as string} />
          </View>

          <View>
            <Column alignItems="flex-start">
              <Text fontSize={18} fontWeight={300} textColor={Colors.white}>
                {title}
              </Text>
              <Text fontSize={12} fontWeight={500} textColor={Colors.white}>
                {total}
              </Text>
            </Column>
          </View>
        </Row>

        {statusList && (
          <Column style={styles.clients_status} gap={4}>
            {statusList.map(({ label, color }: StatusItem, index: number) => (
              <Row key={index} style={styles.statusRow} gap={4}>
                <View style={[styles.statusIndicator, { backgroundColor: color }]} />
                <Text fontSize={12} textColor={Colors.white} transform="capitalize" fontWeight={500}>
                  {label}
                </Text>
              </Row>
            ))}
          </Column>
        )}
      </Column>

      <TouchableOpacity style={styles.shortcuts_item_button} onPress={onPress}>
        <ArrowRightLarge color={backgroundColor} />
      </TouchableOpacity>
    </View>
  );
};
