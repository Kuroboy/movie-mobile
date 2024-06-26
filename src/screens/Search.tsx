import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import KeywordSearch from "../components/search/KeywordSearch";
import CategorySearch from "../components/search/CategorySearch";

const Search = () => {
  const [selectedBar, setSelectedBar] = useState<string>('keyword');

  return (
    <View style={styles.container}>
      <View style={styles.topBarContainer}>
        {['keyword', 'category'].map((item: string, index: number) => (
          <Pressable
            key={item}
            onPress={() => setSelectedBar(item)}
            style={{
              ...styles.topBar,
              backgroundColor: selectedBar === item ? '#8978A4' : '#C0B4D5',
              borderTopLeftRadius: index === 0 ? 100 : 0,
              borderBottomLeftRadius: index === 0 ? 100 : 0,
              borderTopRightRadius: index === 1 ? 100 : 0,
              borderBottomRightRadius: index === 1 ? 100 : 0,
            }}
          >
            <Text style={styles.topBarLabel}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.contentContainer}>
        {selectedBar === 'keyword' ? <KeywordSearch /> : <CategorySearch />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F0F5', 
  },
  topBarContainer: {
    flexDirection: 'row',
    justifyContent: 'center', 
    marginBottom: 20, 
    backgroundColor: '#E0DCEC',
    borderRadius: 100, 
  },
  topBar: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10, 
  },
  topBarLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', 
  },
  contentContainer: {
    flex: 1,
    marginTop: 20, 
  },
});

export default Search;
