import SliderItem from '@/components/commons/slide/slider-item.component';
import { Note } from '@/services/notes.service';
import { ClientStatus } from '@/utils/enum/status.enum';
import { useNoteStore } from '@/zustand/notes/notes.store';
import { useUserStore } from '@/zustand/user/user.store';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

export default function Reminder() {
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
  return (
    <View style={styles.container}>
      <FlatList
        data={remindersData}
        renderItem={({ item }) => (
          <SliderItem
            date={item.date && dayjs(item.date).format('DD/MM/YYYY')}
            title={item.title}
            key={item.id}
            showArrow={false}
            width={'100%'}
            status={ClientStatus.POTENTIAL}
            description={item.description}
          />
        )}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.content_container} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content_container: {
    marginBottom: 16,
  },
});
