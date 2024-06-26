import React from 'react';
import { TouchableOpacity, ImageBackground, Text, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, StackActions } from '@react-navigation/native';
import { Movie } from '../../types/App';

interface MovieItemProps {
  movie: Movie | null; 
  size: { width: number; height: number };
  coverType: 'poster' | 'backdrop';
}

const MovieItem: React.FC<MovieItemProps> = ({ movie, size, coverType }) => {
  const navigation = useNavigation();
  const pushAction = StackActions.push('MovieDetail', { id: movie?.id }); 

  const handlePress = () => {
    if (movie) {
      navigation.dispatch(pushAction);
    }
  };

  if (!movie) {
    return null; 
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <ImageBackground
        resizeMode="cover"
        style={[size, styles.backgroundImage]}
        imageStyle={styles.backgroundImageStyle}
        source={{
          uri: `https://image.tmdb.org/t/p/w500${
            coverType === 'backdrop' ? movie.backdrop_path : movie.poster_path
          }`,
        }}
      >
        <LinearGradient
          colors={['#00000000', 'rgba(0, 0, 0, 0.7)']}
          locations={[0.6, 0.8]}
          style={styles.gradientStyle}
        >
          <Text style={styles.movieTitle}>{movie.title}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="yellow" />
            <Text style={styles.rating}>
              {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    marginRight: 4,
  },
  backgroundImageStyle: {
    borderRadius: 8,
  },
  movieTitle: {
    color: 'white',
  },
  gradientStyle: {
    padding: 8,
    height: '100%',
    width: '100%',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    color: 'yellow',
    fontWeight: '700',
    marginLeft: 4,
  },
});

export default MovieItem;
