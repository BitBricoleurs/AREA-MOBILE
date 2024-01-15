import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

const Dot = ({ anim }) => {
  const scaling = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  return (
    <Animated.View style={[styles.dot, { transform: [{ scale: scaling }] }]} />
  );
};

const TypingAnimation = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const runAnimation = (dot, delay) => {
    return Animated.sequence([
      Animated.delay(delay),
      Animated.timing(dot, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(dot, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]);
  };

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        runAnimation(dot1, 0),
        runAnimation(dot2, 200),
        runAnimation(dot3, 400),
      ])
    ).start();
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.container}>
      <Dot anim={dot1} />
      <Dot anim={dot2} />
      <Dot anim={dot3} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "white",
    margin: 3,
  },
});

export default TypingAnimation;
