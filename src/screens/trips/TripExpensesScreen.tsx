import React, { useEffect, useState } from 'react'
import TripScreensTemplate from '../../components/TripScreensTemplate'
import { View, Button, ScrollView, XStack, YStack, } from "tamagui";
import NotePopOver from '../../components/NotePopOver';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import { EXPENSES_COLLECTION, NOTES_COLLECTION } from '../../constants/collections';
import { useDispatch, useSelector } from 'react-redux';
import { addNote } from '../../slices/notesSlice';
import MyText from '../../components/MyText';
import { DEFAULT_FONT_BOLD } from '../../constants/fonts';
import { addExpense, removeExpense } from '../../slices/expensesSlice';
import TripExpensesPopOver from '../../components/TripExpensesPopOver';
import { Trash2 } from '@tamagui/lucide-icons';
import { useToast } from '../../hooks/toast';

const TripNotesScreen = ({ route: { params: { tripId, } } }) => {
  const dispatch = useDispatch();
  const expenses = useSelector(state => state.expenses.expenses);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [id, setId] = useState("");
  const { showToast, } = useToast();

  useEffect(() => {
    onSnapshot(collection(db, `${EXPENSES_COLLECTION}/${tripId}/${EXPENSES_COLLECTION}`), snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type == "added" || change.type == "modified") {
          const data = change.doc.data();
          data["lastUpdatedAt"] && (data["lastUpdatedAt"] = data["lastUpdatedAt"].toDate().toString());
          dispatch(addExpense({
            id: change.doc.id,
            data,
          }));
        }

        if (change.type == "removed") {
          dispatch(removeExpense({
            id: change.doc.id,
          }));
        }
      })
    });
  }, []);

  function showPopOver(title: string, description: string, id: string) {
    setTitle(title);
    setDescription(description);
    setId(id)
    setOpen(true);
  }

  async function deleteExpense(id) {
    try {
      const docRef = await doc(db, `${EXPENSES_COLLECTION}/${tripId}/${EXPENSES_COLLECTION}/${id}`);
      await deleteDoc(docRef);
      showToast("Expense Deleted!")
    }
    catch (err) {
      showToast("Please try Again")
    }
  }

  return (
    <TripScreensTemplate title='Notes' tripId={tripId} image={require("../../../assets/notes.jpeg")}>
      <TripExpensesPopOver tripId={tripId} open={open} setOpen={setOpen} title={title} description={description} docId={id} />
      <ScrollView h="100%" p="$3" pt="$11">
        {
          Object.entries(expenses).map(([key, expense]) => {
            return (
              <View
                key={key}
                p="$4"
                m="$2"
                bg="$secondaryColor"
                borderRadius="$4"
                justifyContent='space-between'
                flexDirection='row'
                alignItems='center'
                pressStyle={{
                  scale: 1.05,
                  opacity: 0.8,
                }}
                animateOnly={["transform"]}
                animation={"fast"}
                columnGap={"$4"}
              >
                <View
                  flexDirection='row'
                  justifyContent='flex-start'
                  alignItems='center'
                  flex={1}
                  columnGap={"$4"}
                >
                  <View>
                    <MyText fontFamily={DEFAULT_FONT_BOLD} color="$primaryFontColor">{expense.whatWasPaid}</MyText>
                    <MyText color="$secondaryFontColor" textOverflow="ellipsis">{new Date(expense.howMuchWasPaid).toDateString()}</MyText>
                  </View>
                  <MyText fontFamily={DEFAULT_FONT_BOLD} color="$accentColor" fontSize={"$8"}>{expense.howMuchWasPaid}</MyText>
                </View>
                <Button
                  bg={"$primaryColor"}
                  p={0}
                  circular
                  icon={<Trash2 size={20} color={"$secondaryFontColor"} />}
                  onPress={() => deleteExpense(key)}
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