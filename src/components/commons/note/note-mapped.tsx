import React, { useEffect } from 'react';
import { Note } from './note.component';
import { NoteItem } from './note-item.component';
import { useNoteStore } from '@/zustand/notes/notes.store';

interface ClientNotesProps {
  notes: { title: string; description: string; date: Date }[];
  addNote: (note: { title: string; description: string; date: Date }) => void;
  removeNote: (noteTitle: string) => void;
  clientId?: string;
  isEditable?: boolean;
}

export const ClientNotes = ({ notes, addNote, clientId, removeNote, isEditable }: ClientNotesProps) => {
  const { getNotes, notes: notesFromStore } = useNoteStore();
  useEffect(() => {
    const fetchNotes = async () => {
      if (clientId) await getNotes(clientId);
    };

    fetchNotes();
  }, [getNotes, clientId, notesFromStore]);

  return (
    <>
      {!isEditable && <Note label="Notas" addNote={addNote} clientId={clientId || ''} />}
      {notes.map(({ title, description, date }) => (
        <NoteItem key={title} title={title} description={description} date={date} removeNote={removeNote} />
      ))}
      {clientId &&
        notesFromStore.map(({ title, description, date, id }) => (
          <NoteItem key={id} title={title} description={description} date={date} id={id} />
        ))}
    </>
  );
};
