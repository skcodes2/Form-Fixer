import React, { useRef, useState } from 'react'; // <-- ADDED useRef, useState
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Dimensions,          // <-- ADDED Dimensions
  TouchableOpacity,    // <-- ADDED TouchableOpacity for buttons
} from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
    const router = useRouter();
  // =======================
  // 1) CAROUSEL SETUP
  // =======================
  const screenWidth = Dimensions.get('window').width; // for paging calculation

  // Array of images for the carousel (replace with your own if desired)
  const carouselImages = [
    require('../../assets/images/benchpress.jpg'),
    require('../../assets/images/barbellsquat.jpeg'),
    require('../../assets/images/deadlift.jpg'),
    require('../../assets/images/shoulderpress.jpg'),
  ];

  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(xOffset / screenWidth);
    setCurrentIndex(newIndex);
  };

  const goToNextSlide = () => {
    if (currentIndex < carouselImages.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollViewRef.current?.scrollTo({ x: newIndex * screenWidth, animated: true });
    }
  };

  const goToPreviousSlide = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollViewRef.current?.scrollTo({ x: newIndex * screenWidth, animated: true });
    }
  };
  // =======================

  return (
    <ImageBackground
      source={require('../../assets/images/homebg.png')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topSection}>
          <Text style={styles.title}>
            <Text style={{ color: '#8F0404' }}>AI</Text>{' '}
            <Text style={{ color: '#FFFFFF' }}>Fitness Trainer</Text>
          </Text>
        </View>

        <Image source={require('../../assets/images/HomePage.jpeg')} style={styles.homePageContainer}/>

        <Text style={styles.appDescription}>
            FormFixer.ai allows you to plan your workouts, provide meal ideas, and offers real-time form detection abilities to fix your exercise form, like a personal coach in your pocket. Get fit, feel great, and enjoy your journey!
        </Text>
        
        {/* ========================================
            2) ADD THE CAROUSEL BELOW (INSIDE SCROLLVIEW)
        ========================================= */}
        <View style={styles.carouselWrapper}>
          <Text style={styles.carouselTitle}>Latest Features</Text>
          {/* HORIZONTAL SCROLLVIEW FOR CAROUSEL */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ref={scrollViewRef}
            style={styles.carouselContainer}
          >
            {carouselImages.map((image, index) => (
              <View key={index} style={{ width: screenWidth }}>
                <Image source={image} style={styles.carouselImage} />
              </View>
            ))}
          </ScrollView>

          {/* PREVIOUS & NEXT BUTTONS */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={goToPreviousSlide} style={styles.navButton}>
              <Text style={styles.navButtonText}>{'<'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToNextSlide} style={styles.navButton}>
              <Text style={styles.navButtonText}>{'>'}</Text>
            </TouchableOpacity>
          </View>

          {/* INDICATORS (DOTS) */}
          <View style={styles.indicatorContainer}>
            {carouselImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>

          {/* STATUS TEXT (e.g., 1/4) */}
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {currentIndex + 1}/{carouselImages.length}
            </Text>
          </View>
        </View>
        {/* ======================================== */}

        <Text style={styles.chooseFormTitle}>Reach Your Goal</Text>
        <Text style={styles.subDescription}>Amazing Workout Program</Text>

          <View style={[styles.exerciseImagesContainer, { marginTop: 10 }]}>
          </View>
          <View style={[styles.exerciseImagesContainer, { marginTop: 10 }]}>
            <View style={styles.exerciseCard}>
              <View style={styles.imageOverlay}>
                <Image
                  source={require('../../assets/images/dumbellCurl.jpg')}
                  style={styles.exerciseImage}
                />
                <View style={styles.textOverlay}>
                  <Text style={styles.exerciseLabel}>Dumbell Curl</Text>
                </View>
              </View>
            </View>
            <View style={styles.exerciseCard}>
              <View style={styles.imageOverlay}>
                <Image
                  source={require('../../assets/images/inclinedumbbellpress.jpeg')}
                  style={styles.exerciseImage}
                />
                <View style={styles.textOverlay}>
                  <Text style={styles.exerciseLabel}>Shoulder Press</Text>
                </View>
              </View>
            </View>
          </View>

        <TouchableOpacity onPress={() => router.push('/(tabs)/WorkoutPlan')} style={styles.WorkoutPlanButton}>
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center'}}>Start Now</Text>
        </TouchableOpacity>

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // EXISTING STYLES (unchanged)...
  leftFormCard: {
    backgroundColor: 'white',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    width: '45%',
  },
  leftFormText: {
    color: '#990000',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  topSection: {
    alignItems: 'center',
    marginTop: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formMasteryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    padding: 10,
  },
  formCard: {
    backgroundColor: '#990000',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    width: '45%',
  },
  iconAndNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  formNumber: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  formLabel: {
    fontSize: 16,
    color: 'white',
  },
  chooseFormTitle: {
    fontSize: 36,
    color: '#FFFFFF',
    marginTop: 30,
    fontWeight: 'bold',
  },
  appDescription: {
    width: '85%',
    textAlign: 'center',
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: '2%'
  },
  subDescription: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  exerciseImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
  },
  exerciseCard: {
    alignItems: 'center',
    width: '45%',
  },
  imageOverlay: {
    position: 'relative',
    width: '100%',
    height: 150,
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    opacity: 0.9,
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  exerciseLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  homePageContainer: {
    width: '95%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    // marginBottom: '5%',
  },
  WorkoutPlanButton: {
    marginTop: '2%',
    backgroundColor: '#8F0404',
    padding: 10,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: 'white',
    width: '50%',
  },

  // ================
  // NEW CAROUSEL STYLES
  // ================
  carouselWrapper: {
    width: '95%',
    marginTop: 40,
    alignItems: 'center',
  },
  carouselTitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  carouselContainer: {
    width: '95%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    marginBottom: 10,
  },
  carouselImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  buttonContainer: {
    position: 'absolute',
    top: '50%', // adjust to move up/down
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  navButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
    borderColor: 'white',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  statusContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
