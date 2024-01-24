import React, { useEffect, useState } from 'react'
import { Input, View, ScrollView, Button, Spinner, useThemeName, Separator, } from 'tamagui'
import { Search, X } from '@tamagui/lucide-icons'
import { useToast } from '../hooks/toast';
import { DEFAULT_FONT } from '../constants/fonts';

const SearchBar = ({ searchIndex, SearchItem }: { searchIndex?: string, SearchItem: any, }) => {

  const [searchText, setSearchText] = useState("");
  const { showToast, } = useToast();
  const [showSpinner, setShowSpinner] = useState(false);
  const theme = useThemeName();
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  async function getData(searchText: string) {
    try {
      setShowSpinner(true);
      const { hits, } = await searchIndex.search(searchText);
      console.log("hits: ", hits)
      return hits;
    }
    catch (err: any) {
      console.log(err.message);
      return false;
    }
    finally {
      setShowSpinner(false);
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchText.length > 0) {
        const data = await getData(searchText);
        setSearchResults(data);
      }
      else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId)
  }, [searchText]);

  return (
    <View zi={1}>
      <View bg="$secondaryColor" marginHorizontal={"$4"} borderRadius={10} paddingHorizontal={10}>
        <View flexDirection='row' alignItems='center'>
          <Search color="$secondaryFontColor" />
          <Input
            allowFontScaling={false}
            fontFamily={DEFAULT_FONT}
            onFocus={() => setShowResults(true)}
            onBlur={() => setShowResults(false)}
            // disabled={showSpinner}
            onChangeText={setSearchText}
            keyboardAppearance={theme}
            value={searchText}
            flex={1}
            borderWidth={0}
            placeholder='Search...'
            placeholderTextColor="$secondaryFontColor"
            color="$primaryFontColor"
            bg="$secondaryColor"
          />
          {
            searchText ? (showSpinner ? <Spinner color={theme == "dark" ? "#ffffff" : "#000000"} size='small' /> : <Button onPress={() => setSearchText("")} icon={<X color={"$primaryColor"} />} bg={"$secondaryFontColor"} p={0} h={"fit-content"} />) : <></>
          }
        </View>

        <View>
          <View w={"100%"} pos="absolute">
            <ScrollView keyboardShouldPersistTaps="handled" bg="$secondaryColor">
              {
                searchResults.length > 0 ? searchResults.map((item: any, index) => <View opacity={1} key={item.objectID}>
                  {
                    index == 0 ? <Separator borderColor={"$primaryColor"} /> : <></>
                  }
                  {/* goes here */}
                  <SearchItem {...item} />
                  {
                    index != searchResults.length - 1 ? <Separator borderColor={"$primaryColor"} /> : <></>
                  }
                </View>) : <></>
              }
            </ScrollView>
          </View>
        </View>

      </View>
    </View>
  )
}

export default SearchBar