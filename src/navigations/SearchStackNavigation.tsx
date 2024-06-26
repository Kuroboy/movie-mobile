import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MovieDetail from '../screens/MovieDetail';
import Search from '../screens/Search';

const Stack = createNativeStackNavigator();

const HomeStackNavigation = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen 
        name="Search" 
        component={Search} 
        options={{
          headerShown: false
        }} 
      />
        <Stack.Screen 
        name="MovieDetail" 
        component={MovieDetail} 
        options={{
          headerShown: false
        }} 
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigation;
