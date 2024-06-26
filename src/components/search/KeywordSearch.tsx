import { API_ACCESS_TOKEN } from "@env";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TextInput, View, StyleSheet } from "react-native";
import { useDebounce } from 'use-debounce';
import MovieItem from "../movies/MovieItem";
import { Movie } from "../../types/App";


const KeywordSearch = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [keywordValue] = useDebounce(keyword, 1000);
  const [searchResult, setSearchResult] = useState<Movie[]>([]);

  useEffect(() => {
    if (!API_ACCESS_TOKEN) {
      throw new Error('ENV not found');
    }

    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    if (keywordValue) {
      fetch(`https://api.themoviedb.org/3/search/collection?include_adult=false&language=en-US&page=1&query=${keywordValue}`, options)
        .then(async (response) => await response.json())
        .then((data) => {
          setSearchResult(data.results || []);
        })
        .catch((error) => {
          console.error('Error fetching search results:', error);
        });
    } else {
      setSearchResult([]);
    }
  }, [keywordValue]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Input Your Movie"
        onChangeText={(text: string) => setKeyword(text)}
        value={keyword}
      />
      {searchResult.length === 0 ? (
        <Text style={styles.noResultText}>No Result found</Text>
      ) : (
        <FlatList
          style={styles.flatList}
          columnWrapperStyle={styles.columnWrapper}
          numColumns={3}
          showsHorizontalScrollIndicator={false}
          data={searchResult}
          renderItem={({ item }) => (
            <MovieItem
              movie={item}
              size={{
                width: 100,
                height: 160,
              }}
              coverType="poster"
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  input: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    marginVertical: 16,
    borderWidth: 1,         // Menambahkan border dengan lebar 1 piksel
    borderColor: 'black',   // Menambahkan warna border (misalnya hitam)
  },
  noResultText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  flatList: {
    paddingLeft: 16,
    marginTop: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    flexDirection:'row',
    padding: 8,
  },
  flatListContent: {
    paddingBottom: 10,
  },
});

export default KeywordSearch;
