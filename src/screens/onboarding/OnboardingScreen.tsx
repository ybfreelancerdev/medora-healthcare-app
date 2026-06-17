import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
} from 'react-native';
import AppButton from '../../components/AppButton';
import LinearGradient from 'react-native-linear-gradient';
import fonts from '../../constants/fonts';
const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Find Best Doctors',
    description:
      'Search and connect with experienced healthcare specialists near you.',
    image:
      'https://cdn-icons-png.flaticon.com/512/3209/3209265.png',
  },
  {
    id: '2',
    title: 'Book Appointments',
    description:
      'Fast, secure and hassle-free doctor appointment booking.',
    image:
      'https://cdn-icons-png.flaticon.com/512/2785/2785544.png',
  },
  {
    id: '3',
    title: 'Online Consultation',
    description:
      'Consult trusted doctors anytime from the comfort of your home.',
    image:
      'https://cdn-icons-png.flaticon.com/512/3774/3774299.png',
  },
];

export default function OnboardingScreen({ onDone }: any) {
  const flatListRef = useRef<FlatList>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width,
    );

    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
      });
    } else {
      onDone();
    }
  };

  return (
    <LinearGradient
      colors={['#EAF4FF', '#FFFFFF', '#F0FDFA']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content"/>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>
              {item.title}
            </Text>

            <Text style={styles.description}>
              {item.description}
            </Text>
          </View>
        )}
      />

      <View style={styles.bottomContainer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <AppButton
            title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            style={{ marginVertical: 15 }}
            onPress={handleNext}
        />
        {/* <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1
              ? 'Get Started'
              : 'Next'}
          </Text>
        </TouchableOpacity> */}

        {currentIndex !== slides.length - 1 && (
          <TouchableOpacity onPress={onDone}>
            <Text style={styles.skipText}>
              Skip
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  imageContainer: {
    width: 280,
    height: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,

    marginBottom: 40,
  },

  image: {
    width: 180,
    height: 180,
  },

  title: {
    fontSize: 25,
    fontFamily: fonts.name.bold,
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },

  description: {
    fontSize: 15,
    fontFamily: fonts.name.regular,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 6,
  },

  activeDot: {
    width: 28,
    backgroundColor: '#2563EB',
  },

  skipText: {
    textAlign: 'center',
    marginTop: 18,
    fontFamily: fonts.name.medium,
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
});