import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import MovieItem from '../components/movies/MovieItem'; 
import { Movie } from '../types/App';

const Favorite = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused(); 

  useEffect(() => {
    if (isFocused) {
      loadFavoriteMovies();
    }
  }, [isFocused]);

  const loadFavoriteMovies = async () => {
    try {
      const favoriteData = await AsyncStorage.getItem('@FavoriteList');
      if (favoriteData !== null) {
        const parsedData = JSON.parse(favoriteData) as Movie[];
        setFavoriteMovies(parsedData);
      }
      setLoading(false);
    } catch (error) {
      console.log('Error loading favorite movies:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favoriteMovies.length === 0 ? (
        <Text>No favorite movies found.</Text>
      ) : (
        <FlatList
          style={styles.flatList}
          columnWrapperStyle={styles.columnWrapper}
          numColumns={3}
          showsHorizontalScrollIndicator={false}
          data={favoriteMovies}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    paddingLeft: 16,
    marginTop: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    flexDirection: 'row', 
    padding: 8,
  },
  flatListContent: {
    paddingBottom: 10,
  },
});

export default Favorite;

