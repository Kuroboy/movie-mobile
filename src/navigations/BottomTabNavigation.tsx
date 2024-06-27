import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import HomeStackNavigation from './HomeStackNavigation';
import Search from '../screens/Search';
import FavoriteStackNavigation from "./FavoriteStackNavigation"
import SearchStackNavigation from "./SearchStackNavigation"
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="HomeStacNavigation"
      component={HomeStackNavigation}
      options={{
        title: 'Home',
        tabBarIcon: ({ color }) => (
          <Feather name="home" size={28} color={color} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="SearchStackNavigation"
      component={SearchStackNavigation}
      options={{
        title: 'Search',
        tabBarIcon: ({ color }) => (
          <Feather name="search" size={28} color={color} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="FavoriteStackNavigation"
      component={FavoriteStackNavigation}
      options={{
        title: 'Favorite',
        tabBarIcon: ({ color }) => (
          <Feather name="heart" size={28} color={color} />
        ),
        headerShown: false,
      }}
    />
  </Tab.Navigator>
);

export default BottomTabNavigator;
