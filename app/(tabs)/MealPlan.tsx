import React, { useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TextInput, StyleSheet, Linking } from 'react-native';
import axios from 'axios';
import { Card, Button } from 'react-native-paper';

const API_KEY = "0a8ca4b54f8f45548ff705a87bea61c5";
const SEARCH_URL = "https://api.spoonacular.com/recipes/complexSearch";

type Meal = {
  id: number;
  title: string;
  image: string;
  sourceUrl: string;
};

export default function MealPlan() {
  const [searchQuery, setSearchQuery] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]); // <-- Use the Meal[] type here
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch meal list based on search
  const fetchMeals = async () => {
    if (!searchQuery) {
      setError("Please enter a food name to search.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(SEARCH_URL, {
        params: {
          apiKey: API_KEY,
          query: searchQuery,
          number: 5,
          addRecipeInformation: true, // so we get sourceUrl in the results
        },
      });
      // response.data.results should match the Meal type
      setMeals(response.data.results);
    } catch (err) {
      setError("Failed to fetch meals. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Open recipe website
  const openWebsite = (sourceUrl: string) => { // <-- Declare type string
    if (sourceUrl) {
      Linking.openURL(sourceUrl);
    } else {
      setError("No website found for this recipe.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Search for Recipes</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.input}
        placeholder="Enter a meal name (e.g., pasta)"
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Button mode="contained" onPress={fetchMeals} style={styles.button}>
        Search
      </Button>

      {loading && <ActivityIndicator size="large" color="#6200ee" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <ScrollView style={styles.mealList}>
        {meals.map((meal) => (
          <Card key={meal.id} style={styles.card}>
            <Image source={{ uri: meal.image }} style={styles.image} />
            <Card.Content>
              <Text style={styles.mealTitle}>{meal.title}</Text>
              <Button 
                mode="outlined" 
                onPress={() => openWebsite(meal.sourceUrl)} 
                style={styles.websiteButton}
              >
                View Recipe
              </Button>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginBottom: 10,
  },
  mealList: {
    marginTop: 10,
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  websiteButton: {
    marginTop: 5,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
