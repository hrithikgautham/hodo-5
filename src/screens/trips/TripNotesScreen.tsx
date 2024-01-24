import React, { useEffect, useState } from 'react'
import TripScreensTemplate from '../../components/TripScreensTemplate'
import { View, Button, ScrollView, XStack, YStack, } from "tamagui";
import NotePopOver from '../../components/NotePopOver';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import { NOTES_COLLECTION } from '../../constants/collections';
import { useDispatch, useSelector } from 'react-redux';
import { addNote, removeNote } from '../../slices/notesSlice';
import MyText from '../../components/MyText';
import { DEFAULT_FONT_BOLD } from '../../constants/fonts';
import { Trash2 } from '@tamagui/lucide-icons';
import { useToast } from '../../hooks/toast';

const TripNotesScreen = ({ route: { params: { tripId, } } }) => {
  const dispatch = useDispatch();
  const notes = useSelector(state => state.notes.notes);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [id, setId] = useState("");
  const { showToast, } = useToast();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, `${NOTES_COLLECTION}/${tripId}/${NOTES_COLLECTION}`), snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type == "added" || change.type == "modified") {
          const data = change.doc.data();
          data["lastUpdatedAt"] && (data["lastUpdatedAt"] = data["lastUpdatedAt"].toDate().toString());
          dispatch(addNote({
            id: change.doc.id,
            data,
          }))
        }

        if (change.type == "removed") {
          dispatch(removeNote({
            id: change.doc.id,
          }))
        }
      })
    });

    return () => unsub()
  }, []);

  async function deleteNote(id) {
    try {
      const docRef = await doc(db, `${NOTES_COLLECTION}/${tripId}/${NOTES_COLLECTION}/${id}`);
      await deleteDoc(docRef);
      showToast("Note Deleted!")
    }
    catch (err) {
      showToast("Please try Again")
    }
  }

  function showPopOver(title: string, description: string, id: string) {
    setTitle(title);
    setDescription(description);
    setId(id)
    setOpen(true);
  }

  return (
    <TripScreensTemplate title='Notes' tripId={tripId} image={require("../../../assets/notes.jpeg")}>
      <NotePopOver tripId={tripId} open={open} setOpen={setOpen} title={title} description={description} docId={id} />
      <ScrollView h="100%" p="$3" pt="$11">
        {
          Object.entries(notes).map(([key, note]) => {
            return (
              <View
                key={key}
                p="$4"
                m="$2"
                bg="$secondaryColor"
                borderRadius="$4"
                onPress={() => showPopOver(note.title, note.description, key)}
                justifyContent='space-between'
                flexDirection='row'
                alignItems='center'
                pressStyle={{
                  scale: 1.05,
                  opacity: 0.8,
                }}
                animateOnly={["transform"]}
                animation={"fast"}
              >
                <View

                >
                  <MyText fontFamily={DEFAULT_FONT_BOLD} color="$primaryFontColor">{note.title}</MyText>
                  <MyText color="$secondaryFontColor" textOverflow="ellipsis">{note.description}</MyText>
                </View>
                <Button
                  bg={"$primaryColor"}
                  p={0}
                  circular
                  icon={<Trash2 size={20} color={"$secondaryFontColor"} />}
                  onPress={() => deleteNote(key)}
                />
              </View>
            )
          })
        }
      </ScrollView>
    </TripScreensTemplate>
  )
}

export default TripNotesScreen