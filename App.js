import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts, Outfit_500Medium } from '@expo-google-fonts/outfit';
import MyText from './utils/MyText';

export default function App() {
  [loaded] = useFonts({
    Outfit_500Medium,
  });

  return (
    <>
      {loaded ? (
        <View style={styles.container}>
          <MyText>Open up App.js to start working on your app!</MyText>
          <StatusBar style="auto" />
        </View>
      ) : (
        <View>
          <Text>Loading...</Text>
        </View>
      )}
    </>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
