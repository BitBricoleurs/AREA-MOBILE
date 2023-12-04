import { View, Image, Text, StyleSheet } from 'react-native';
import MyText from '../../utils/myText';
import { dark } from '../../utils/colors';

const CustomSplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 6, justifyContent: "flex-end", marginBottom: 24 }}>
        <Image source={require('../../assets/logo-color.png')} style={styles.logo} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.logoText}>BotButler</Text>
      </View>
      <View style={{ flex: 6 }}>
        <Text style={styles.tagline}>Craft Your Workflow,</Text>
        <Text style={styles.tagline}>Automate Your Success</Text>
      </View>
    </View>
  );
}

export default CustomSplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 44,
    fontWeight: 'bold',
    textAlign: 'center',
    color: dark.text,
  },
  tagline: {
    fontSize: 22,
    textAlign: 'center',
    marginTop: 8,
    color: dark.text,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  }
});