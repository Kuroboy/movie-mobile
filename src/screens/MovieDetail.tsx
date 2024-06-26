import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, ScrollView, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ACCESS_TOKEN } from '@env';
import { FontAwesome } from '@expo/vector-icons';
import { Movie } from '../types/App';

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchMovieDetail();
    fetchSimilarMovies();
  }, []);

  useEffect(() => {
    if (movie) {
      checkIfFavorite();
    }
  }, [movie]);

  const fetchMovieDetail = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setMovie(response);
        setLoading(false);
      })
      .catch((errorResponse) => {
        console.log(errorResponse);
        setLoading(false);
      });
  };

  const fetchSimilarMovies = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}/similar`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setSimilarMovies(response.results);
      })
      .catch((errorResponse) => {
        console.log(errorResponse);
      });
  };

  const checkIfFavorite = async () => {
    try {
      const initialData = await AsyncStorage.getItem('@FavoriteList');
      if (initialData !== null) {
        const favMovieList = JSON.parse(initialData);
        const isFav = favMovieList.some((favMovie: Movie) => favMovie.id === id);
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addFavorite = async (movie: Movie): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      let favMovieList: Movie[] = [];
  
      if (initialData !== null) {
          favMovieList = [...JSON.parse(initialData), movie];
      } else {
          favMovieList = [movie];
      }
      
      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList));
      setIsFavorite(true);
    } catch (error) {
      console.log('Error adding favorite:', error);
    }
  };

  const removeFavorite = async (movie: Movie): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
  
      if (initialData !== null) {
        const parsedData: Movie[] = JSON.parse(initialData);
        const updatedList: Movie[] = parsedData.filter((m) => m.id !== movie.id);
        await AsyncStorage.setItem('@FavoriteList', JSON.stringify(updatedList));
  
        setIsFavorite(false);
      }
    } catch (error) {
      console.log('Error removing favorite movie:', error);
    }
  };

  const handleFavoritePress = () => {
    if (!movie) {
      console.log('Movie data is not loaded yet.');
      return;
    }

    if (isFavorite) {
      removeFavorite(movie);
    } else {
      addFavorite(movie);
    }
  };

  if (loading || !movie) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView>
      <ImageBackground
        style={styles.backdrop}
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` }}
      >
        <View style={styles.overlay}>
          <View style={styles.titleContainer}>
            <View>
              <Text style={styles.title}>{movie.title}</Text>
              <View style={styles.ratingContainer}>
                <FontAwesome name="star" size={20} color="yellow" />
                <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleFavoritePress}>
              <FontAwesome name={isFavorite ? "heart" : "heart-o"} size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.container}>
        <Text style={styles.heading}>Overview</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
        <Text style={styles.heading}>Details</Text>
        <Text>Language: {movie.original_language}</Text>
        <Text>Release Date: {movie.release_date}</Text>
        <Text>Popularity: {movie.popularity}</Text>
        <Text>Votes: {movie.vote_count}</Text>
        <Text style={styles.heading}>Similar Movies</Text>
        <FlatList
          style={styles.similarMoviesList}
          horizontal
          data={similarMovies}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.similarMovieItem}
              onPress={() => {
                
              }}
            >
              <ImageBackground
                style={styles.similarMovieImage}
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                resizeMode="cover"
              >
                <View style={styles.overlay}>
                  <Text style={styles.similarMovieTitle}>{item.title}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    height: 300,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  rating: {
    color: 'yellow',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 5,
  },
  container: {
    padding: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  overview: {
    fontSize: 16,
    marginVertical: 10,
  },
  similarMoviesList: {
    marginTop: 10,
  },
  similarMovieItem: {
    marginRight: 10,
  },
  similarMovieImage: {
    width: 100,
    height: 150,
    justifyContent: 'flex-end',
  },
  similarMovieTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MovieDetail;
