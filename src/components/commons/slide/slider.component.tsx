import { View, FlatList, Pressable } from 'react-native';

import { Colors } from '@/utils/constants/Colors';
import { scaleSize } from '@/utils';
import { Text } from '../text/text.component';
import { Column } from '../layout/column/column.component';
import styles from './slider.style';
import { SliderProps } from './slider.type';
import { Row } from '../layout/row/row.component';
import { ArrowRightOutlined, NotificationSlash } from '../../../../assets/svg';
import { Container } from '../layout/container/container.component';
import { Flex } from '../layout/flex/flex.component';
import SliderItem from './slider-item.component';
import { router } from 'expo-router';
import { useUserStore } from '@/zustand/user/user.store';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { useNoteStore } from '@/zustand/notes/notes.store';
import { Note } from '@/services/notes.service';
import { truncateText } from '@/helpers/truncate-text.helper';
import React from 'react';

export type noteType = { id: string; title: string; isReminder: string; description: string; created_at: Date }[];

export const Slider = (props: SliderProps) => {
  const { name = 'Recordatorios' } = props;
  const user = useUserStore((state) => state.user);
  const { reminders, getReminders } = useNoteStore();
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        await getReminders(user.id!);
      } catch (err) {}
    };

    fetchNotes();
  }, [getReminders, user.id]);

  const remindersData = reminders.filter((note: Note) => note.isReminder === true);

  if (reminders?.length === 0) {
    return (
      <Container gap={12} paddingHorizontal={12}>
        <Text fontSize={16} fontWeight={600}>
          {name}
        </Text>

        <View style={styles.slide_empty}>
          <Row gap={scaleSize(12)} alignItems="center" style={styles.slide_empty_background}>
            <View style={styles.slide_image_container}>
              <NotificationSlash />
            </View>

            <View>
              <Column alignItems="flex-start" gap={scaleSize(8)}>
                <Text fontSize={14} fontWeight={600} textColor={Colors.white}>
                  Sin recordatorios
                </Text>
                <Text fontSize={12} fontWeight={500} textColor={Colors.white}>
                  En este espacio podrás ver los {'\n'}recordatorios importantes
                </Text>
              </Column>
            </View>
          </Row>
        </View>
      </Container>
    );
  }

  return (
    <>
      <View style={styles.slide_content_container}>
        <Flex direction="row" alignItems="center" justifyContent="space-between">
          <Text fontSize={16} fontWeight={600}>
            {name}
          </Text>
          <Pressable onPress={() => router.push('/reminders/')}>
            <Row alignItems="center" justifyContent="center" style={styles.slide_more}>
              <Text fontWeight={400} fontSize={12}>
                Mas
              </Text>
              <ArrowRightOutlined color={Colors.black} />
            </Row>
          </Pressable>
        </Flex>

        <FlatList
          contentContainerStyle={styles.containerSlider}
          data={remindersData}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => (
            <SliderItem
              date={dayjs(item?.created_at).format('DD/MM/YYYY')}
              title={truncateText(item.title, 25)}
              key={item?.id}
              description={truncateText(item.description, 25)}
            />
          )}
        />
      </View>
    </>
  );
};
