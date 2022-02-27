
import React,{useState,useEffect} from 'react';
import Rating from './Rating';
const { width, height } = Dimensions.get('window');

import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';

const SPACING = 10;
const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.72 : width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;
export default function App() {
  const [data,setData] = useState([]);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    fetch('https://api.jikan.moe/v4/top/anime')
    .then(res=>res.json())
    .then(res=>setData(res.data))
  },[])
  return (
    <View style={styles.container}>
       <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.mal_id}
        horizontal
        bounces={false}
        decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
        renderToHardwareTextureAndroid
        contentContainerStyle={{ alignItems: 'center' }}
        snapToInterval={ITEM_SIZE}
        snapToAlignment='start'
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          if (!item.images.jpg.image_url) {
            return <View style={{ width: EMPTY_ITEM_SIZE }} />;
          }

          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
          ];

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [100, 50, 100],
            extrapolate: 'clamp',
          });

          return (
            <View style={{ width: ITEM_SIZE }}>
              <Animated.View
                style={{
                  marginHorizontal: SPACING,
                  padding: SPACING * 2,
                  alignItems: 'center',
                  transform: [{ translateY }],
                  backgroundColor: 'white',
                  borderRadius: 34,
                }}
              >
                <Image
                  source={{ uri: item.images.jpg.image_url}}
                  style={styles.posterImage}
                />
                <Text style={{ fontSize: 24 }} numberOfLines={1}>
                  {item.title}
                </Text>
                <Rating rating={item.score} />
                <Text style={{ fontSize: 12 }} numberOfLines={3}>
                  {item.synopsis}
                </Text>
              </Animated.View>
            </View>
          );
        }}
      />
      {/* {data.map((item) =>{
        return(
          <View style={styles.card}>
            <Image
          source={{
            uri: item.images.jpg.image_url,
          }}
          style={styles.posterImage}
        />
            <Text style={styles.title}>{item.title}</Text>
            <Rating rating={item.score} />
          </View>
        );
      })} */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily:'sans-serif',
    flex: 1,
    backgroundColor: '#fff',
  },
  carousel: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    resizeMode: 'cover',
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
  card: {
    
  },
});
