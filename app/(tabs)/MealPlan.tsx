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
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          number: 15,
          addRecipeInformation: true,
        },
      });
      setMeals(response.data.results);
    } catch (err) {
      setError("Failed to fetch meals. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const openWebsite = (sourceUrl: string) => {
    if (sourceUrl) {
      Linking.openURL(sourceUrl);
    } else {
      setError("No website found for this recipe.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search for Recipes</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a meal name (e.g., pasta)"
        placeholderTextColor="#aaa"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Button mode="contained" onPress={fetchMeals} style={styles.button} labelStyle={styles.buttonLabel}>
        Search
      </Button>

      {loading && <ActivityIndicator size="large" color="#990000" />}
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
                labelStyle={styles.websiteButtonLabel}
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
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#333',
    color: '#fff',
  },
  button: {
    marginBottom: 10,
    backgroundColor: '#990000',
  },
  buttonLabel: {
    color: '#fff',
  },
  mealList: {
    marginTop: 10,
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: '#222', 
  },
  image: {
    width: '100%',
    height: 150,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#fff',
  },
  websiteButton: {
    marginTop: 5,
    borderColor: '#990000',
    backgroundColor: '#990000',
  },
  websiteButtonLabel: {
    color: '#fff',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
