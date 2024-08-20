import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, ImageBackground, ScrollView } from 'react-native';

const fetchCatImages = async (callback) => {
  try {
    const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=10');
    const data = await response.json();
    callback(data);
  } catch (error) {
    console.error("Error fetching cat images:", error);
  }
};

export default function App() {
  const [catImages, setCatImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  const loadImages = () => {
    setLoading(true);
    fetchCatImages((images) => {
      setCatImages(images);
      setLoading(false);
    });
  };

  const toggleFavorite = (image) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(image.id)) {
        return prevFavorites.filter((id) => id !== image.id);
      } else {
        return [...prevFavorites, image.id];
      }
    });
  };

  useEffect(() => {
    loadImages();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff6347" />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1516116216624-1c5c2e5d5c36' }}
        style={styles.background}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Gatos Fofos 🐱</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {catImages.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image
                source={{ uri: item.url }}
                style={styles.image}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={[styles.favoriteButton, favorites.includes(item.id) && styles.favorited]}
                onPress={() => toggleFavorite(item)}
              >
                <Text style={styles.favoriteText}>{favorites.includes(item.id) ? '❤️' : '♡'}</Text>
              </TouchableOpacity>
              <Text style={styles.imageId}>ID: {item.id}</Text>
            </View>
          ))}
        </ScrollView>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop:40,
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-start',
  },
  header: {
    padding: 15,
    backgroundColor: '#ff6347', 
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  scrollViewContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    width: '90%', 
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
  },
  favorited: {
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
  },
  favoriteText: {
    fontSize: 24,
  },
  imageId: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
    marginBottom: 10,
    paddingBottom: 10,
  },
});
