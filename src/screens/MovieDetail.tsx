import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, ScrollView, ActivityIndicator, FlatList, TouchableOpacity, Pressable, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ACCESS_TOKEN } from '@env';
import { FontAwesome } from '@expo/vector-icons';
import { Movie } from '../types/App';
import MovieList from "../components/movies/MovieList";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageEnum } from '../types/Enum'

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation();

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
      .then(async (response) => {
        if (response.status === 404) {
          throw new Error('Movie not found');
        }
        return await response.json();
      })
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

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `${movie.title}\n\n${movie.overview}\n\n${movie.homepage}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type of: ' + result.activityType);
        } else {
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Dismissed');
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <ScrollView>
      <ImageBackground
        style={styles.backdrop}
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` }}
      >
        <Pressable style={styles.backIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Pressable style={styles.shareIcon} onPress={onShare}>
          <Ionicons name="share-social" size={24} color="white" />
        </Pressable>
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
        <View style={styles.detailContainer}>
          <View >
            <Text style={styles.label}>Release Date</Text>
            <Text style={styles.additionalInfo}>{movie.release_date}</Text>
          </View>
          <View >
            <Text style={styles.label}>Popularity</Text>
            <Text style={styles.additionalInfo}>{movie.popularity}</Text>
          </View>
        </View>
        <View style={styles.detailContainer}>
          <View >
            <Text style={styles.label}>Votes</Text>
            <Text style={styles.additionalInfo}>{movie.vote_count}</Text>
          </View>
          <View >
            <Text style={styles.label}>Language</Text>
            <Text style={styles.additionalInfo}>{LanguageEnum[movie.original_language as keyof typeof LanguageEnum]}</Text>
          </View>
        </View>
      </View>
      <View style={styles.recommendationContainer}>
        <MovieList
          key='Recommended Movies'
          title='Recommended Movies'
          path={`movie/${movie.id}/recommendations?language=en-US&page=1`}
          coverType='poster'
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
    padding: 16,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  additionalInfo: {
    fontSize: 14,
    color: 'black',
    marginTop: 5,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  recommendationContainer: {
    padding: 16,
  },
  backIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
  },
  shareIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
});

export default MovieDetail;
