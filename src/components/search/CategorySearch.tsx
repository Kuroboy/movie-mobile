import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import MovieItem from '../movies/MovieItem';
import { Movie } from '../../types/App';

const CategorySearch = () => {
    const [category, setCategory] = useState<string>('');
    const [searchResult, setSearchResult] = useState<Movie[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('');

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

        if (category) {
            fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${category}`, options)
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
    }, [category]);

    const handleCategoryPress = (category: string) => {
        setCategory(category);
        setActiveCategory(category);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.categoryText}>Select a category:</Text>
            <View style={styles.categoryList}>
                <Text
                    style={[styles.categoryItem, activeCategory === '28' && styles.activeCategory]}
                    onPress={() => handleCategoryPress('28')}
                >
                    Action
                </Text>
                <Text
                    style={[styles.categoryItem, activeCategory === '12' && styles.activeCategory]}
                    onPress={() => handleCategoryPress('12')}
                >
                    Adventure
                </Text>
                <Text
                    style={[styles.categoryItem, activeCategory === '16' && styles.activeCategory]}
                    onPress={() => handleCategoryPress('16')}
                >
                    Animation
                </Text>
                <Text
                    style={[styles.categoryItem, activeCategory === '35' && styles.activeCategory]}
                    onPress={() => handleCategoryPress('35')}
                >
                    Comedy
                </Text>
                <Text
                    style={[styles.categoryItem, activeCategory === '80' && styles.activeCategory]}
                    onPress={() => handleCategoryPress('80')}
                >
                    Crime
                </Text>
                <Text
                    style={[styles.categoryItem, activeCategory === '99' && styles.activeCategory]}
                    onPress={() => handleCategoryPress('99')}
                >
                    Documentary
                </Text>
                <Text
                    style={[styles.categoryItem, activeCategory === '18' && styles.activeCategory]}
                    onPress={() => handleCategoryPress('18')}
                >
                    Drama
                </Text>
                <Text
                    style={[styles.categoryItem, activeCategory === '10751' && styles.activeCategory]}
                    onPress={() => handleCategoryPress('10751')}
                >
                    Family
                </Text>
            </View>
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
    categoryText: {
        fontSize: 16,
        marginBottom: 10,
    },
    categoryList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryItem: {
        fontSize: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        margin: 5,
    },
    activeCategory: {
        backgroundColor: '#ccc',
        color: 'white',
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
        flexDirection: 'row',
        padding: 8,
    },
    flatListContent: {
        paddingBottom: 10,
    },
});

export default CategorySearch;